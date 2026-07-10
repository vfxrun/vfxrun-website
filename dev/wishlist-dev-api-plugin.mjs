/**
 * Local Astro dev mock for POST /api/wishlist when Cloudflare Pages Functions + D1 are unavailable.
 * Set WISHLIST_DEV_MOCK=0 to return 503 instead (tests real error UI).
 */
export function wishlistDevApiPlugin() {
  return {
    name: 'vfxrun-wishlist-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/wishlist', (req, res, next) => {
        if (req.method !== 'POST') {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'method_not_allowed' }));
          return;
        }

        if (process.env.WISHLIST_DEV_MOCK === '0') {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              error: 'database_unavailable',
              message:
                'Wishlist API mock disabled (WISHLIST_DEV_MOCK=0). Use wrangler pages dev with D1.',
            }),
          );
          return;
        }

        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
          let body;
          try {
            body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'invalid_body' }));
            return;
          }

          let validateWishlistPayload;
          try {
            ({ validateWishlistPayload } = await import('../lib/wishlist.ts'));
          } catch (error) {
            next(error);
            return;
          }

          const validation = validateWishlistPayload(body);
          if (!validation.ok) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: validation.error }));
            return;
          }

          if (process.env.WISHLIST_DEV_MOCK !== 'silent') {
            const masked = validation.data.email.replace(/(.{2}).+(@.+)/, '$1***$2');
            console.info('[wishlist-dev-mock] saved vote', {
              email: masked,
              features: validation.data.features,
              language: validation.data.language,
              source_page: validation.data.source_page,
            });
          }

          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ ok: true, mock: true }));
        });
        req.on('error', next);
      });
    },
  };
}
