/** Matches VFXRun Browser desktop app locales. */
export const SUPPORTED_LOCALES = [
  'en',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
  'es',
  'fr',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LANGUAGE_STORAGE_KEY = 'vfxrun:language';

/** Locales with full website copy. */
export const FULLY_TRANSLATED_LOCALES: Locale[] = [...SUPPORTED_LOCALES];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
};

export function resolveLocale(candidate: unknown): Locale | null {
  if (typeof candidate !== 'string' || !candidate.trim()) return null;
  const tag = candidate.trim().replace(/_/g, '-');
  if ((SUPPORTED_LOCALES as readonly string[]).includes(tag)) return tag as Locale;

  const [rawBase, rawRegion = ''] = tag.split('-');
  const base = rawBase.toLowerCase();
  const region = rawRegion.toUpperCase();

  if (base === 'zh') {
    if (region === 'TW' || region === 'HK' || region === 'MO' || region === 'HANT') return 'zh-TW';
    return 'zh-CN';
  }
  if (base === 'en') return 'en';
  if (base === 'ja') return 'ja';
  if (base === 'ko') return 'ko';
  if (base === 'es') return 'es';
  if (base === 'fr') return 'fr';
  return null;
}

export function getEffectiveLocale(locale: Locale): Locale {
  return FULLY_TRANSLATED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}
