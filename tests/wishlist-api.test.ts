import { describe, expect, it } from 'vitest';
import { onRequestPost } from '../functions/api/wishlist';

describe('POST /api/wishlist', () => {
  it('returns 503 when D1 is not bound', async () => {
    const response = await onRequestPost({
      request: new Request('https://vfxrun.com/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          features: ['timeline'],
          language: 'en',
          source_page: '/vfxrun/pro',
        }),
      }),
      env: {},
      params: {},
      waitUntil: () => {},
      next: async () => new Response(),
      data: {},
    });

    expect(response.status).toBe(503);
    const json = (await response.json()) as { error: string };
    expect(json.error).toBe('database_unavailable');
  });

  it('returns 201 when D1 save succeeds', async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          run: async () => ({ success: true }),
        }),
      }),
    } as unknown as D1Database;

    const response = await onRequestPost({
      request: new Request('https://vfxrun.com/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          features: ['filters', 'export-all'],
          language: 'en',
          source_page: '/',
        }),
      }),
      env: { DB: db },
      params: {},
      waitUntil: () => {},
      next: async () => new Response(),
      data: {},
    });

    expect(response.status).toBe(201);
    const json = (await response.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
  });
});
