import { describe, expect, it } from 'vitest';
import { validateWishlistPayload } from '../lib/wishlist';

describe('validateWishlistPayload', () => {
  it('rejects invalid email format', () => {
    const result = validateWishlistPayload({
      email: 'not-an-email',
      features: ['timeline'],
      language: 'en',
      source_page: '/vfxrun/pro',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('email_invalid');
  });

  it('rejects when no features are selected', () => {
    const result = validateWishlistPayload({
      email: 'user@example.com',
      features: [],
      language: 'en',
      source_page: '/',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('features_required');
  });

  it('rejects unknown feature ids', () => {
    const result = validateWishlistPayload({
      email: 'user@example.com',
      features: ['timeline', 'not-real'],
      language: 'en',
      source_page: '/',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('features_invalid');
  });

  it('accepts a valid payload and normalizes email', () => {
    const result = validateWishlistPayload({
      email: '  User@Example.COM ',
      features: ['timeline', 'color', 'timeline'],
      language: 'zh-CN',
      source_page: '/vfxrun/pro#features',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe('user@example.com');
      expect(result.data.features).toEqual(['timeline', 'color']);
      expect(result.data.language).toBe('zh-CN');
      expect(result.data.source_page).toBe('/vfxrun/pro#features');
    }
  });
});
