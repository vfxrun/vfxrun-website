/** Allowed Pro wishlist feature ids — keep in sync with `PRO_VOTE_FEATURES` in src/config/site.ts */
export const ALLOWED_WISHLIST_FEATURE_IDS = [
  'timeline',
  'color',
  'filters',
  'export-all',
] as const;

export type AllowedWishlistFeatureId = (typeof ALLOWED_WISHLIST_FEATURE_IDS)[number];

export type WishlistPayload = {
  email: string;
  features: AllowedWishlistFeatureId[];
  language: string;
  source_page: string;
};

export type WishlistValidationError =
  | 'invalid_body'
  | 'email_required'
  | 'email_invalid'
  | 'features_required'
  | 'features_invalid';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SET = new Set<string>(ALLOWED_WISHLIST_FEATURE_IDS);

export function isValidWishlistEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > 254) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function normalizeWishlistFeatures(features: unknown): AllowedWishlistFeatureId[] | null {
  if (!Array.isArray(features) || features.length === 0) return null;

  const unique: AllowedWishlistFeatureId[] = [];
  for (const item of features) {
    if (typeof item !== 'string' || !ALLOWED_SET.has(item)) return null;
    if (!unique.includes(item as AllowedWishlistFeatureId)) {
      unique.push(item as AllowedWishlistFeatureId);
    }
  }

  return unique.length > 0 ? unique : null;
}

export function validateWishlistPayload(
  body: unknown,
):
  | { ok: true; data: WishlistPayload }
  | { ok: false; error: WishlistValidationError } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'invalid_body' };
  }

  const record = body as Record<string, unknown>;
  const email = typeof record.email === 'string' ? record.email.trim() : '';

  if (!email) {
    return { ok: false, error: 'email_required' };
  }

  if (!isValidWishlistEmail(email)) {
    return { ok: false, error: 'email_invalid' };
  }

  const features = normalizeWishlistFeatures(record.features);
  if (!features) {
    const raw = record.features;
    if (!Array.isArray(raw) || raw.length === 0) {
      return { ok: false, error: 'features_required' };
    }
    return { ok: false, error: 'features_invalid' };
  }

  const language = typeof record.language === 'string' ? record.language.trim().slice(0, 16) : 'en';
  const source_page =
    typeof record.source_page === 'string' ? record.source_page.trim().slice(0, 256) : '/';

  return {
    ok: true,
    data: {
      email: email.toLowerCase(),
      features,
      language: language || 'en',
      source_page: source_page || '/',
    },
  };
}

export async function saveWishlistVote(
  db: D1Database,
  data: WishlistPayload,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO wishlist_votes (email, features, language, source_page, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
    )
    .bind(data.email, JSON.stringify(data.features), data.language, data.source_page)
    .run();
}
