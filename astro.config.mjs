import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { wishlistDevApiPlugin } from './dev/wishlist-dev-api-plugin.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEETGEN_SRC = path.resolve(__dirname, 'src/apps/sheetgen');

// https://astro.build/config
export default defineConfig({
  site: 'https://vfxrun.com',
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [wishlistDevApiPlugin()],
    resolve: {
      alias: {
        '@core': path.join(SHEETGEN_SRC, 'core'),
        '@sheetgen-src': SHEETGEN_SRC,
      },
    },
  },
});
