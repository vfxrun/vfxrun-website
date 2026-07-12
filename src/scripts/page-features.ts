import { initSheetGenToolI18nObserver } from './sheetgen-tool-i18n';

export function initPageFeatures(): void {
  if (document.querySelector('[data-browser-carousel]')) {
    void import('./browser-carousel.ts').then((mod) => mod.initBrowserCarousels());
  }

  if (document.querySelector('#vote-form')) {
    void import('./browser-pro-vote.ts').then((mod) => mod.initBrowserProVote());
  }

  if (document.querySelector('#browser-share-btn')) {
    void import('./browser-share.ts').then((mod) => mod.initBrowserShare());
  }

  if (document.querySelector('.sheetgen-tool-mount')) {
    initSheetGenToolI18nObserver();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageFeatures);
} else {
  initPageFeatures();
}

document.addEventListener('astro:page-load', initPageFeatures);
