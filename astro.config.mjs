import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shiru2.github.io/portfolyo-me',
  base: '/portfolyo-me',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
