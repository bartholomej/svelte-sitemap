import { Options } from './interfaces/global.interface';

export const APP_NAME = 'svelte-sitemap';

export const DOMAIN = 'https://example.com';

export const OPTIONS: Options = { resetTime: false, debug: false, changeFreq: 'weekly' };

export const OUT_DIR = 'build';

// Google recommends to split sitemap into multiple files if there are more than 50k pages
// https://support.google.com/webmasters/answer/183668?hl=en
export const CHUNK_SIZE = 50_000;
