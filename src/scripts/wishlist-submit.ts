import type { WishlistPayload } from '../../lib/wishlist';

export type WishlistSubmitResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

export async function submitWishlistVote(payload: WishlistPayload): Promise<WishlistSubmitResult> {
  try {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let data: { error?: string } = {};
    try {
      data = (await response.json()) as { error?: string };
    } catch {
      /* non-json error body */
    }

    if (!response.ok) {
      return { ok: false, error: data.error ?? 'submit_failed', status: response.status };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}

export function currentWishlistLanguage(): string {
  return document.documentElement.dataset.locale || document.documentElement.lang || 'en';
}

export function currentWishlistSourcePage(): string {
  return `${window.location.pathname}${window.location.hash}`;
}
