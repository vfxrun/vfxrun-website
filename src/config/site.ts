export const SITE = {
  name: 'VFXRun',
  url: 'https://vfxrun.com',
  title: 'VFXRun — Free tools for 2D game VFX workflows',
  description:
    'VFXRun is a free local 2D VFX browser for previewing PNG sequences, GIFs, and sprite sheets before importing them into Godot, Unity, or other engines. SheetGen is a free browser-based sprite sheet generator by VFXRun.',
  tagline: 'Free tools for 2D game VFX workflows.',
  subtagline:
    'Browse local PNG sequence effects with VFXRun Browser, and pack sprite sheets online with SheetGen. Built for Godot, Unity, and 2D game developers.',
} as const;

/** Primary product tabs in the site header. */
export const PRIMARY_TABS = [
  { href: '/', label: 'VFXRun', tab: 'browser' as const },
  { href: '/sheetgen', label: 'SheetGen', tab: 'sheetgen' as const },
] as const;

/** Secondary links shown to the right of the primary tabs. */
export const SECONDARY_NAV_LINKS = [
  { href: '/docs', label: 'Docs', minWidth: '5.5rem' },
  { href: '/feedback', label: 'Feedback', minWidth: '6.25rem' },
  { href: '/discord', label: 'Discord', minWidth: '4.5rem' },
] as const;

export const VFXRUN_SECTIONS = [
  { id: 'overview', labelKey: 'browser.sections.overview' },
  { id: 'download', labelKey: 'browser.sections.download' },
  { id: 'pro', labelKey: 'browser.sections.pro' },
  { id: 'faq', labelKey: 'browser.sections.faq' },
] as const;

export const SHEETGEN_INFO_SECTIONS = [
  { id: 'export-workflow', labelKey: 'sheetgen.sections.workflow' },
  { id: 'settings', labelKey: 'sheetgen.sections.settings' },
  { id: 'use-with-vfxrun', labelKey: 'sheetgen.sections.useWith' },
  { id: 'faq', labelKey: 'sheetgen.sections.faq' },
] as const;

export const BROWSER_CAROUSEL_SLIDES = [
  { src: '/images/browser-carousel/VFXRun_Carousel_01.png', captionKey: 'browser.carousel.slide1' },
  { src: '/images/browser-carousel/VFXRun_Carousel_02.png', captionKey: 'browser.carousel.slide2' },
  { src: '/images/browser-carousel/VFXRun_Carousel_03.png', captionKey: 'browser.carousel.slide3' },
  { src: '/images/browser-carousel/VFXRun_Carousel_04.png', captionKey: 'browser.carousel.slide4' },
  { src: '/images/browser-carousel/VFXRun_Carousel_05.png', captionKey: 'browser.carousel.slide5' },
  { src: '/images/browser-carousel/VFXRun_Carousel_06.png', captionKey: 'browser.carousel.slide6' },
] as const;

export const PRO_VOTE_FEATURES = [
  { id: 'timeline', labelKey: 'browser.proFeatureTimeline' },
  { id: 'color', labelKey: 'browser.proFeatureColor' },
  { id: 'filters', labelKey: 'browser.proFeatureFilters' },
  { id: 'export-all', labelKey: 'browser.proFeatureExportAll' },
] as const;

export const PRIVACY_STATEMENT =
  'Your local files stay on your device. VFXRun only collects anonymous usage statistics to improve the product. We do not upload file names, file paths, image content, or project assets.';

export const CONTACT_EMAIL = 'ningzw1005@gmail.com';

export const DISCORD_INVITE_URL = 'https://discord.gg/4y6QFSHxW';

export type DownloadAsset = {
  href: string;
  fileName: string;
  version: string;
  assetGitTag: string;
  r2Key: string;
  fallbackUrl: string;
};

export const WINDOWS_DOWNLOAD: DownloadAsset = {
  href: '/downloads/VFXRun-Setup-Windows.exe',
  fileName: 'VFXRun-Setup-Windows.exe',
  version: '1.3.3',
  assetGitTag: 'desktop-v1.3.3',
  r2Key: 'VFXRun-Setup-Windows.exe',
  fallbackUrl:
    'https://raw.githubusercontent.com/vfxrun/vfxrun-website/desktop-v1.3.3/public/downloads/VFXRun-Setup-Windows.exe',
};

export const MACOS_DOWNLOAD: DownloadAsset = {
  href: '/downloads/VFXRun-macOS-arm64.dmg',
  fileName: 'VFXRun-macOS-arm64.dmg',
  version: '1.3.3',
  assetGitTag: 'desktop-v1.3.3',
  r2Key: 'VFXRun-macOS-arm64.dmg',
  fallbackUrl:
    'https://raw.githubusercontent.com/vfxrun/vfxrun-website/desktop-v1.3.3/public/downloads/VFXRun-macOS-arm64.dmg',
};

export const DOWNLOAD_ASSETS: Record<string, DownloadAsset> = {
  [WINDOWS_DOWNLOAD.fileName]: WINDOWS_DOWNLOAD,
  [MACOS_DOWNLOAD.fileName]: MACOS_DOWNLOAD,
};

/** Flip to `true` when Pro is officially for sale — reveals pricing, FAQ, and full nav. */
export const PRO_LAUNCHED = false;

const VFXRUN_PRO_SECTIONS_LAUNCH = [
  { id: 'features', labelKey: 'browser.proSections.features' },
  { id: 'trial', labelKey: 'browser.proSections.trial' },
  { id: 'pricing', labelKey: 'browser.proSections.pricing' },
  { id: 'faq', labelKey: 'browser.proSections.faq' },
  { id: 'wishlist', labelKey: 'browser.proSections.wishlist' },
] as const;

/** Pre-launch: wishlist voting lives at `#features`; `#wishlist` is a legacy alias. */
const VFXRUN_PRO_SECTIONS_PRE_LAUNCH = [
  { id: 'features', labelKey: 'browser.proSections.wishlist' },
  { id: 'trial', labelKey: 'browser.proSections.trial' },
] as const;

export const VFXRUN_PRO_SECTIONS = PRO_LAUNCHED
  ? VFXRUN_PRO_SECTIONS_LAUNCH
  : VFXRUN_PRO_SECTIONS_PRE_LAUNCH;
