import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SHEETGEN_CANDIDATES = [
  process.env.SHEETGEN_ROOT,
  'C:/Users/young/Documents/Texture Packer',
  path.resolve(__dirname, '../../SheetGen'),
].filter((candidate) => typeof candidate === 'string' && candidate.length > 0);

const SHEETGEN_ROOT =
  SHEETGEN_CANDIDATES.find((candidate) => fs.existsSync(path.join(candidate, 'src', 'web', 'App.tsx'))) ??
  SHEETGEN_CANDIDATES[0];

const SHEETGEN_SRC = path.join(SHEETGEN_ROOT, 'src');

// https://astro.build/config
export default defineConfig({
  site: 'https://vfxrun.com',
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: {
        '@core': path.join(SHEETGEN_SRC, 'core'),
        '@sheetgen-src': SHEETGEN_SRC,
      },
    },
    server: {
      fs: {
        allow: [__dirname, SHEETGEN_ROOT],
      },
    },
  },
});
