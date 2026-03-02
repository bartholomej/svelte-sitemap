export const APP_NAME = 'svelte-sitemap';

export const DOMAIN = 'https://example.com';

export const OUT_DIR = 'build';

// Google recommends to split sitemap into multiple files if there are more than 50k pages
// https://support.google.com/webmasters/answer/183668?hl=en
export const CHUNK = {
  maxSize: 50_000
};

export const CONFIG_FILES = [
  'svelte-sitemap.config.js',
  'svelte-sitemap.config.mjs',
  'svelte-sitemap.config.cjs',
  'svelte-sitemap.config.ts',
  'svelte-sitemap.config.mts',
  'svelte-sitemap.config.cts',
  'svelte-sitemap.config.json'
];
