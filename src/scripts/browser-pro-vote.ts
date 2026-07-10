import type { WishlistPayload } from '../../lib/wishlist';
import { proVoteSubmittedProperties, track } from './analytics';
import {
  currentWishlistLanguage,
  currentWishlistSourcePage,
  submitWishlistVote,
} from './wishlist-submit';

function getMessage(key: string, fallback: string): string {
  const el = document.querySelector(`[data-i18n="${key}"]`);
  return el?.textContent?.trim() || fallback;
}

function showStatus(form: HTMLFormElement, message: string, isError: boolean): void {
  let status = form.querySelector<HTMLParagraphElement>('[data-vote-status]');
  if (!status) {
    status = document.createElement('p');
    status.dataset.voteStatus = '';
    status.className = 'pro-vote-form__status';
    form.appendChild(status);
  }
  status.textContent = message;
  status.classList.toggle('is-error', isError);
  status.hidden = false;
}

function setSubmitting(form: HTMLFormElement, submitting: boolean): void {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (button) button.disabled = submitting;
  form.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
    input.disabled = submitting;
  });
}

function resolveSubmitError(error: string, status?: number): string {
  if (error === 'email_invalid' || error === 'email_required') {
    return getMessage('browser.proVoteErrorEmail', 'Enter a valid email address.');
  }
  if (error === 'features_required' || error === 'features_invalid') {
    return getMessage('browser.proVoteErrorFeatures', 'Select at least one feature.');
  }
  if (status === 503 || error === 'database_unavailable') {
    return getMessage(
      'browser.proVoteErrorServer',
      'Wishlist is temporarily unavailable. Please try again later.',
    );
  }
  return getMessage('browser.proVoteErrorSubmit', 'Could not save your vote. Please try again.');
}

export function initBrowserProVote(): void {
  const form = document.querySelector<HTMLFormElement>('#vote-form');
  if (!form || form.dataset.voteBound === '1') return;
  form.dataset.voteBound = '1';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedFeatures = [...form.querySelectorAll<HTMLInputElement>('input[name="feature"]:checked')].map(
      (input) => input.value,
    );
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    const email = emailInput?.value.trim() ?? '';

    if (selectedFeatures.length === 0) {
      showStatus(form, getMessage('browser.proVoteErrorFeatures', 'Select at least one feature.'), true);
      return;
    }

    if (!email || !emailInput?.checkValidity()) {
      showStatus(form, getMessage('browser.proVoteErrorEmail', 'Enter a valid email address.'), true);
      emailInput?.focus();
      return;
    }

    void (async () => {
      setSubmitting(form, true);
      showStatus(form, getMessage('browser.proVoteSubmitting', 'Saving your vote…'), false);

      const result = await submitWishlistVote({
        email,
        features: selectedFeatures as WishlistPayload['features'],
        language: currentWishlistLanguage(),
        source_page: currentWishlistSourcePage(),
      });

      setSubmitting(form, false);

      if (!result.ok) {
        showStatus(form, resolveSubmitError(result.error, result.status), true);
        return;
      }

      track('pro_vote_submitted', proVoteSubmittedProperties(selectedFeatures));

      showStatus(
        form,
        getMessage(
          'browser.proVoteSuccess',
          'Thanks for voting. Your choices have been saved. We may email you when Pro trials or requested features become available.',
        ),
        false,
      );
      form.reset();
    })();
  });
}
