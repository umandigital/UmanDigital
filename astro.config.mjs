// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: trocar pelo domínio definitivo antes do primeiro deploy.
// `site` alimenta o sitemap, as URLs canônicas e as tags Open Graph.
const SITE = 'https://umandigital.com.br';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
