export const APP_NAME = 'svelte-sitemap';

export const DOMAIN = 'https://example.com';

export const OUT_DIR = 'build';

// Google recommends to split sitemap into multiple files if there are more than 50k pages
// https://support.google.com/webmasters/answer/183668?hl=en
export const CHUNK = {
  maxSize: 50_000
};

export const CONFIG_FILE = 'svelte-sitemap.cjs';

// export const OPTIONS: Options = {
//   domain: DOMAIN,
//   resetTime: false,
//   debug: false,
//   changeFreq: 'weekly'
// };
