import { saveWishlistVote, validateWishlistPayload } from '../../lib/wishlist';

interface Env {
  DB?: D1Database;
}

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'invalid_body' }, 400);
  }

  const validation = validateWishlistPayload(body);
  if (!validation.ok) {
    return jsonResponse({ error: validation.error }, 400);
  }

  const db = context.env.DB;
  if (!db) {
    return jsonResponse(
      {
        error: 'database_unavailable',
        message:
          'Wishlist storage is not configured. Bind a D1 database named DB in Cloudflare Pages settings.',
      },
      503,
    );
  }

  try {
    await saveWishlistVote(db, validation.data);
    return jsonResponse({ ok: true }, 201);
  } catch (error) {
    console.error('[wishlist] failed to save vote', error);
    return jsonResponse({ error: 'save_failed' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return jsonResponse({ error: 'method_not_allowed' }, 405);
};
