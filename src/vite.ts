import type { Plugin } from 'vite';
import { INTEGRATION_METHODS } from './const.js';
import type { OptionsSvelteSitemap } from './dto/index.js';
import { createSitemap } from './index.js';

export function svelteSitemap(options: OptionsSvelteSitemap): Plugin {
  let isSvelteKit = false;
  let isSSR = false;
  let generated = false;

  const generate = async () => {
    generated = true;
    await createSitemap(options, INTEGRATION_METHODS.VITE);
  };

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
      await generate();
    },
    // SvelteKit 3 builds all environments in its own buildApp hook and runs the adapter in a 'post' one
    buildApp: {
      order: 'post',
      handler: async (builder) => {
        const isBuilt = Object.values(builder.environments).some((env) => env.isBuilt);
        if (isSvelteKit && isBuilt && !generated) {
          await generate();
        }
      }
    }
  };
}
