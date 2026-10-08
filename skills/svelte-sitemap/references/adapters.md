# Adapters and `outDir`

`svelte-sitemap` reads prerendered HTML from `outDir` and writes `sitemap.xml` into the same folder. Set `outDir` to where the adapter puts prerendered pages:

| Adapter                        | `outDir`                             | Also needed                                                                                                        |
| ------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `@sveltejs/adapter-static`     | `build` (default, no need to set)    | If the adapter has `pages: 'dist'`, use that folder. With a `fallback` page (e.g. `404.html`), add it to `ignore`. |
| `@sveltejs/adapter-vercel`     | `.vercel/output/static`              | –                                                                                                                  |
| `@sveltejs/adapter-cloudflare` | `.svelte-kit/cloudflare` (see below) | `ignore: ['404.html']`. On Cloudflare Pages also exclude `/sitemap.xml` from the adapter's `routes` (below).       |
| `@sveltejs/adapter-netlify`    | `build` (default)                    | –                                                                                                                  |
| `@sveltejs/adapter-node`       | Not supported                        | The Node server only serves files known at build time, so `/sitemap.xml` returns 404.                              |

Any other adapter: build once, locate the prerendered HTML and use that folder:

```bash
find . -name '*.html' -not -path './node_modules/*' -not -path './.svelte-kit/output/*'
```

**Cloudflare and wrangler config**: `.svelte-kit/cloudflare` is the output only without a wrangler config (`wrangler.toml`, `wrangler.json`, `wrangler.jsonc`). If it sets `pages_build_output_dir` (Pages) or `assets.directory` (Workers), use that folder as `outDir`. The `routes` option and `_routes.json` only exist for Cloudflare Pages.

`adapter-vercel` refuses to build on Node versions it doesn't support yet (e.g. Node 26). That's unrelated to `svelte-sitemap`: use Node 22/24 or set the adapter's `runtime`.

## Where adapter options go

SvelteKit 2 (`svelte.config.js`):

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ routes: { include: ['/*'], exclude: ['<all>', '/sitemap.xml'] } })
  }
};

export default config;
```

SvelteKit 3 (no `svelte.config.js`, options go to the Vite plugin):

```ts
// vite.config.ts
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteSitemap } from 'svelte-sitemap/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ routes: { include: ['/*'], exclude: ['<all>', '/sitemap.xml'] } })
    }),
    svelteSitemap({
      domain: 'https://example.com',
      outDir: '.svelte-kit/cloudflare',
      ignore: ['404.html']
    })
  ]
});
```

On SvelteKit 2 the `svelteSitemap({...})` part is the same, only `sveltekit()` stays without options.
