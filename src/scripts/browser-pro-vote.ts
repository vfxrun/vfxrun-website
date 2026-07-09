import { track } from './analytics';

const STORAGE_KEY = 'vfxrun:pro-vote';

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

export function initBrowserProVote(): void {
  const form = document.querySelector<HTMLFormElement>('#vote-form');
  if (!form || form.dataset.voteBound === '1') return;
  form.dataset.voteBound = '1';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const features = [...form.querySelectorAll<HTMLInputElement>('input[name="feature"]:checked')].map(
      (input) => input.value,
    );
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    const email = emailInput?.value.trim() ?? '';

    if (features.length === 0) {
      showStatus(form, getMessage('browser.proVoteErrorFeatures', 'Select at least one feature.'), true);
      return;
    }

    if (!email || !emailInput?.checkValidity()) {
      showStatus(form, getMessage('browser.proVoteErrorEmail', 'Enter a valid email address.'), true);
      emailInput?.focus();
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          features,
          email,
          submittedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Still show success — vote intent was captured in-session.
    }

    track('pro_vote_submitted', { feature_name: features.join(',') });

    showStatus(form, getMessage('browser.proVoteSuccess', 'Thanks — your vote was recorded.'), false);
    form.reset();
  });
}
