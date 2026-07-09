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

## Project layout

- `src/pages/` — routes (fixed URL structure per shared project context)
- `src/layouts/` — page shells
- `src/components/` — shared UI
- `src/config/site.ts` — site copy and navigation
- `public/` — static assets, `robots.txt`, `llms.txt`
