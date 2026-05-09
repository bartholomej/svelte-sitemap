import type { Plugin } from 'vite';
import type { OptionsSvelteSitemap } from './dto/index.js';
import { createSitemap } from './index.js';

export function svelteSitemap(options: OptionsSvelteSitemap): Plugin {
  return {
    name: 'svelte-sitemap',
    apply: 'build',
    closeBundle: async () => {
      await createSitemap(options);
    }
  };
}
