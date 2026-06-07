import type { Plugin } from 'vite';
import type { OptionsSvelteSitemap } from './dto/index.js';
import { createSitemap } from './index.js';

export function svelteSitemap(options: OptionsSvelteSitemap): Plugin {
  let isSvelteKit = false;
  let isSSR = false;

  return {
    name: 'svelte-sitemap',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      isSvelteKit = config.plugins.some(
        (p) => p.name.includes('sveltekit') || p.name.startsWith('sveltekit:')
      );
      isSSR = !!config.build?.ssr;
    },
    closeBundle: async () => {
      if (isSvelteKit && !isSSR) {
        return;
      }
      await createSitemap(options);
    }
  };
}
