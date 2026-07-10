# VFXRun.com Website

Official product site for [VFXRun Browser](https://vfxrun.com/vfxrun) and [SheetGen](https://vfxrun.com/sheetgen).

Built with [Astro](https://astro.build). Static output for Cloudflare Pages.

Planning docs live alongside this repo — see `VFXRun_Website_Launch_Plan.md` in this directory.

## Design tokens

| Token | CSS variable | Hex | Usage |
|-------|----------------|-----|--------|
| Accent text | `--accent-text` | `#46a4fb` | Links, highlighted text, ghost buttons, form accents |
| Button | `--accent` | `#5c68f7` | Primary button backgrounds, carousel progress, CTA fills |

Hover variants: `--accent-text-hover` (`#67b4fc`), `--accent-hover` (`#6d78ff`).

Defined in `src/styles/global.css`. SheetGen embed overrides live in `src/components/sheetgen/sheetgen-overrides.css`.

## Local development

```bash
npm install
npm run dev
```

Dev server: http://localhost:4321

## Build

```bash
npm run build
npm run preview
```

SheetGen web UI is bundled in `src/apps/sheetgen/` (no external checkout required for build or deploy).

## Cloudflare Pages

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 22.x (see `engines` in package.json) |

### Pro Wishlist API (`POST /api/wishlist`)

Votes are stored in **Cloudflare D1** via `functions/api/wishlist.ts`.

1. Create the database and apply the schema:
   ```bash
   npx wrangler d1 create vfxrun-wishlist
   npx wrangler d1 execute vfxrun-wishlist --remote --file=./migrations/0001_wishlist.sql
   ```
2. Copy the `database_id` into `wrangler.toml`.
3. In **Cloudflare Pages → Settings → Functions → D1 bindings**, bind the database as **`DB`**.
4. Redeploy. Without D1, the API returns **503** and the form shows an error (no fake success).

Local `npm run dev` mocks `/api/wishlist` (set `WISHLIST_DEV_MOCK=0` to test error UI). For local D1 + Functions, use `npm run pages:dev` after `wrangler d1 execute ... --local`.

## Project layout

- `src/pages/` — routes (fixed URL structure per shared project context)
- `src/layouts/` — page shells
- `src/components/` — shared UI
- `src/config/site.ts` — site copy and navigation
- `public/` — static assets, `robots.txt`, `llms.txt`
- `functions/` — Cloudflare Pages Functions (wishlist API)
- `lib/wishlist.ts` — shared wishlist validation + D1 insert
- `migrations/` — D1 SQL schema
