export interface LicenseInfo {
  isPro: boolean;
  licenseKey?: string;
}

const PRO_KEY_PATTERN = /^PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;

export function validateLicenseKey(key: string): boolean {
  return PRO_KEY_PATTERN.test(key.trim());
}

export function resolveLicense(licenseKey?: string): LicenseInfo {
  if (licenseKey && validateLicenseKey(licenseKey)) {
    return { isPro: true, licenseKey: licenseKey.trim().toUpperCase() };
  }
  return { isPro: false, licenseKey: licenseKey?.trim() || undefined };
}

export function proFeatureMessage(feature: string): string {
  return `${feature} requires SheetGen Pro. Enter a valid license key in Settings.`;
}
