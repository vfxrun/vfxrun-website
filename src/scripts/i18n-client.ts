import {
  DEFAULT_LOCALE,
  LANGUAGE_STORAGE_KEY,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  resolveLocale,
  type Locale,
} from '../i18n/locales';
import { getFlatBundleForLocale } from '../i18n/i18n-bundles';
import { CONTACT_EMAIL } from '../config/site';
import { applySheetGenToolTranslations } from './sheetgen-tool-i18n';

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const fromStorage = resolveLocale(stored);
    if (fromStorage) return fromStorage;
  } catch {
    /* ignore storage errors */
  }

  const fromDom = resolveLocale(document.documentElement.dataset.locale);
  if (fromDom) return fromDom;

  try {
    return resolveLocale(navigator.language) ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function closeLanguageMenu() {
  const menu = document.getElementById('lang-menu');
  const toggle = document.getElementById('lang-toggle');
  menu?.setAttribute('hidden', '');
  toggle?.setAttribute('aria-expanded', 'false');
}

function isInsidePendingIsland(el: Element): boolean {
  const island = el.closest('astro-island');
  return Boolean(island?.hasAttribute('ssr'));
}

function applyFeedbackMailtoLinks(bundle: Record<string, string>): void {
  const subject = bundle['feedbackPage.mailtoSubject'];
  const body = bundle['feedbackPage.mailtoBody'];
  if (!subject || !body) return;

  const email =
    document.querySelector<HTMLElement>('[data-contact-email]')?.dataset.contactEmail ?? CONTACT_EMAIL;
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  document.querySelectorAll<HTMLAnchorElement>('[data-feedback-mailto]').forEach((link) => {
    link.href = href;
  });
}

function applyTranslations(locale: Locale) {
  const bundle = getFlatBundleForLocale(locale);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (isInsidePendingIsland(el)) return;
    const key = el.getAttribute('data-i18n');
    if (!key || !(key in bundle)) return;
    el.textContent = bundle[key];
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    if (isInsidePendingIsland(el)) return;
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key || !(key in bundle) || !(el instanceof HTMLElement)) return;
    el.setAttribute('aria-label', bundle[key]);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    if (isInsidePendingIsland(el)) return;
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key || !(key in bundle) || !(el instanceof HTMLInputElement)) return;
    el.placeholder = bundle[key];
  });
  applyFeedbackMailtoLinks(bundle);
  document.documentElement.lang = locale.includes('-') ? locale : locale.split('-')[0];
  document.documentElement.dataset.locale = locale;
  document.documentElement.dataset.i18nReady = '1';
  applySheetGenToolTranslations(locale);
}

function syncLanguageSelector(locale: Locale) {
  document.querySelectorAll('[data-locale-option]').forEach((btn) => {
    const value = btn.getAttribute('data-locale-option');
    btn.classList.toggle('active', value === locale);
    if (btn instanceof HTMLButtonElement) {
      btn.setAttribute('aria-pressed', value === locale ? 'true' : 'false');
    }
  });
  document.querySelectorAll('[data-lang-current]').forEach((el) => {
    const label = LOCALE_LABELS[locale] ?? LOCALE_LABELS.en;
    el.textContent = label;
  });
}

export function initI18n() {
  const locale = getInitialLocale();
  applyTranslations(locale);
  syncLanguageSelector(locale);

  document.querySelectorAll('[data-locale-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-locale-option');
      const resolved = resolveLocale(next);
      if (!resolved) return;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, resolved);
      applyTranslations(resolved);
      syncLanguageSelector(resolved);
      closeLanguageMenu();
      document.dispatchEvent(new CustomEvent('vfxrun:locale-change', { detail: { locale: resolved } }));
    });
  });
}

declare global {
  interface Window {
    __VFXRUN_I18N__?: { locales: readonly Locale[]; labels: typeof LOCALE_LABELS };
  }
}

window.__VFXRUN_I18N__ = { locales: SUPPORTED_LOCALES, labels: LOCALE_LABELS };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}

document.addEventListener('astro:page-load', () => {
  applyTranslations(getInitialLocale());
});
