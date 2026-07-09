import { flattenMessages } from './deep-merge';
import { MESSAGES } from './messages';
import { flattenSheetgenToolForLocale } from './sheetgen-tool-messages';
import { flattenExtendedPagesForLocale } from './extended-pages-i18n';
import { flattenStaticPagesForLocale } from './static-pages-i18n';
import { SUPPORTED_LOCALES, type Locale } from './locales';

const FLAT_EN = {
  ...flattenMessages(MESSAGES.en),
  ...flattenSheetgenToolForLocale('en'),
  ...flattenStaticPagesForLocale('en'),
  ...flattenExtendedPagesForLocale('en'),
};

const FLAT_MESSAGES = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [
    locale,
    {
      ...FLAT_EN,
      ...flattenMessages(MESSAGES[locale]),
      ...flattenSheetgenToolForLocale(locale),
      ...flattenStaticPagesForLocale(locale),
      ...flattenExtendedPagesForLocale(locale),
    },
  ]),
) as Record<Locale, Record<string, string>>;

export function getFlatBundleForLocale(locale: Locale): Record<string, string> {
  return FLAT_MESSAGES[locale] ?? FLAT_MESSAGES.en;
}

export function defaultFlatText(key: string): string {
  return FLAT_EN[key] ?? key;
}
