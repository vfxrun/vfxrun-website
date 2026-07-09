import type { Locale } from '../i18n/locales';
import { SUPPORTED_LOCALES } from '../i18n/locales';
import { getFlatBundleForLocale } from '../i18n/i18n-bundles';
import {
  SHEETGEN_TOOL_I18N_KEYS,
  sheetgenToolAltSources,
} from '../i18n/sheetgen-tool-messages';

function variantsForKey(key: string, target: string): string[] {
  const variants = new Set<string>();
  for (const locale of SUPPORTED_LOCALES) {
    const value = getFlatBundleForLocale(locale)[key];
    if (value && value !== target) variants.add(value);
  }
  const en = getFlatBundleForLocale('en')[key];
  if (en && en !== target) variants.add(en);
  return [...variants].sort((a, b) => b.length - a.length);
}

function altSourcesForKey(key: string): string[] {
  const suffix = key.replace(/^sheetgen\.tool\./, '') as keyof typeof sheetgenToolAltSources;
  return sheetgenToolAltSources[suffix] ?? [];
}

function replaceInText(value: string, from: string, to: string): string {
  if (!from || from === to || !value.includes(from)) return value;
  return value.split(from).join(to);
}

function applyReplacements(value: string, pairs: Array<[string, string]>): string {
  let next = value;
  for (const [from, to] of pairs) {
    next = replaceInText(next, from, to);
  }
  return next;
}

export function applySheetGenToolTranslations(locale: Locale) {
  const mount = document.querySelector('.sheetgen-tool-mount');
  if (!mount?.querySelector('.app-shell')) return;

  const flat = getFlatBundleForLocale(locale);
  const pairs: Array<[string, string]> = [];

  for (const key of SHEETGEN_TOOL_I18N_KEYS) {
    const target = flat[key];
    if (!target) continue;
    for (const variant of variantsForKey(key, target)) {
      pairs.push([variant, target]);
    }
    for (const alt of altSourcesForKey(key)) {
      if (alt !== target) pairs.push([alt, target]);
    }
  }

  pairs.sort((a, b) => b[0].length - a[0].length);

  const walker = document.createTreeWalker(mount, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node.textContent ?? '';
    if (text.trim()) {
      const replaced = applyReplacements(text, pairs);
      if (replaced !== text) node.textContent = replaced;
    }
    node = walker.nextNode();
  }

  mount.querySelectorAll<HTMLElement>('[placeholder], [title], [aria-label], [alt]').forEach((el) => {
    for (const attr of ['placeholder', 'title', 'aria-label', 'alt'] as const) {
      const raw = el.getAttribute(attr);
      if (!raw) continue;
      const replaced = applyReplacements(raw, pairs);
      if (replaced !== raw) el.setAttribute(attr, replaced);
    }
  });
}

export function initSheetGenToolI18nObserver() {
  const mount = document.querySelector('.sheetgen-tool-mount');
  if (!mount || mount.dataset.i18nObserverReady === '1') return;

  let observer: MutationObserver | undefined;
  let timer: number | undefined;
  let applying = false;

  const apply = () => {
    if (applying || !mount.querySelector('.app-shell')) return;
    applying = true;
    try {
      const locale = (document.documentElement.dataset.locale ?? 'en') as Locale;
      applySheetGenToolTranslations(locale);
    } finally {
      applying = false;
    }
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(apply, 120);
  };

  const attach = () => {
    if (mount.dataset.i18nObserverReady === '1') return;
    if (!mount.querySelector('.app-shell')) return;

    mount.dataset.i18nObserverReady = '1';
    apply();
    document.addEventListener('vfxrun:locale-change', schedule);
    observer = new MutationObserver(schedule);
    observer.observe(mount, { childList: true, subtree: true });
  };

  const island = mount.querySelector('astro-island');
  island?.addEventListener('astro:hydrate', attach, { once: true });

  if (mount.querySelector('.app-shell')) {
    attach();
    return;
  }

  const pollId = window.setInterval(() => {
    if (mount.querySelector('.app-shell')) {
      window.clearInterval(pollId);
      attach();
    }
  }, 150);
  window.setTimeout(() => window.clearInterval(pollId), 20000);
}
