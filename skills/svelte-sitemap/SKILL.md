---
name: svelte-sitemap
description: Adds and configures sitemap.xml generation for SvelteKit apps with the svelte-sitemap library (Vite plugin). Use when the user wants a sitemap, sitemap.xml or SEO setup in a SvelteKit project, uses svelte-sitemap, needs per-page priority, changefreq or lastmod, hreflang alternates for multilingual sites, excluding pages from the sitemap, or a sitemap with adapter-static, adapter-vercel or adapter-cloudflare.
license: MIT
metadata:
  author: bartholomej
  version: '1.0'
---

# svelte-sitemap

`svelte-sitemap` generates `sitemap.xml` from the **prerendered HTML files** of a SvelteKit build. It runs automatically at the end of `vite build` via its Vite plugin.

## 1. Inspect the project first

Before changing anything, find out:

- **SvelteKit major version**: `@sveltejs/kit` in `package.json`.
  - SvelteKit 2: SvelteKit config usually lives in `svelte.config.js`.
  - SvelteKit 3: there is no `svelte.config.js`; config is passed to `sveltekit({ adapter: … })` in `vite.config.ts`.
- **Adapter**: `@sveltejs/adapter-static`, `adapter-vercel`, `adapter-cloudflare`, … It decides where prerendered HTML ends up (`outDir`), see [references/adapters.md](references/adapters.md).
- **Prerendering**: the library only sees pages that are prerendered. Look for `export const prerender = true` (usually in `src/routes/+layout.ts` or `+layout.js`).
- **Trailing slashes**: `export const trailingSlash = 'always'` in a layout means the sitemap needs `trailingSlashes: true`.
- **Production domain**: ask the user if it isn't obvious from the project. It must be the full URL, e.g. `https://example.com`.
- **Pages to leave out**: list the prerendered routes. If some look private (admin, drafts, previews), ask the user whether to exclude them. Don't exclude pages on your own; `/404` and fallback pages are the only ones to drop without asking.
- **Node.js**: 20 or newer.

Version requirements: SvelteKit 3 needs `svelte-sitemap` 4.0.6+, the `transform` option needs 4.1.0+.

## 2. Install

Skip this if `svelte-sitemap` is already in `package.json` (check the version requirements above).

```bash
npm install -D svelte-sitemap
```

Use the project's package manager (`pnpm add -D`, `yarn add -D`, `bun add -d`).

## 3. Add the Vite plugin

Add `svelteSitemap()` **after** `sveltekit()` in `vite.config.ts` (or `.js`). Keep all existing `sveltekit(...)` options as they are.

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteSitemap } from 'svelte-sitemap/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(), // SvelteKit 3: keep e.g. sveltekit({ adapter: adapter() })
    svelteSitemap({
      domain: 'https://example.com'
    })
  ]
});
```

Set `outDir` when the adapter doesn't write to `build/` ([references/adapters.md](references/adapters.md)).

If the project already runs `svelte-sitemap` as a `postbuild` script or uses `svelte-sitemap.config.ts`, that's the legacy setup: move the options into `svelteSitemap({...})` and remove the script and config file, unless the user wants to keep it.

## 4. Options

| Option            | Use                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`          | Required. Full production URL.                                                                                                             |
| `outDir`          | Folder with the prerendered HTML. Default `build`.                                                                                         |
| `fileName`        | Output file name. Default `sitemap.xml`. Set e.g. `sitemap-main.xml` when `sitemap.xml` is a hand-written sitemap index that links to it.  |
| `trailingSlashes` | `true` when SvelteKit uses `trailingSlash: 'always'`.                                                                                      |
| `ignore`          | Pages to leave out, relative to `outDir`: names or glob patterns, e.g. `['404', 'admin', '**/drafts/**']`.                                 |
| `additional`      | Extra paths that have no prerendered file, e.g. SPA routes: `['contact', 'pricing']`.                                                      |
| `changeFreq`      | Default change frequency: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.                                             |
| `resetTime`       | `true` sets `lastmod` of every page to the build date.                                                                                     |
| `transform`       | Function to customize or exclude each page (priority, per-page lastmod, hreflang). See [references/transform.md](references/transform.md). |
| `debug`           | Logs options and the generated entries.                                                                                                    |

`ignore` and versions: since 4.1.1 a plain name like `ignore: ['admin']` removes the page itself (`admin.html` or `admin/index.html`) and everything under `admin/`. Before 4.1.1 it didn't match flat page files (`build/admin.html`, SvelteKit's default `trailingSlash`), so on older versions use `admin.html`, or exclude by URL in `transform` (`return null`), which works on any version.

To keep `/admin` but drop the pages under it, use `transform` (`path.startsWith('/admin/')`). `ignore: ['admin/**']` only does that with the default `trailingSlash`; with `trailingSlash: 'always'` the page is `admin/index.html` and gets removed too.

## 5. Verify

Run the production build (`npm run build` or `vite build`) and then check:

1. The log contains `✔ Done. Check your new sitemap here: ./<outDir>/sitemap.xml`.
2. `<outDir>/sitemap.xml` exists and lists the expected URLs, with the correct domain and trailing slashes.
3. Excluded pages (e.g. `/404`) are not in it.
4. Cloudflare Pages only: `<outDir>/_routes.json` lists `/sitemap.xml` under `exclude`, otherwise the deployed site answers `/sitemap.xml` with 404.

**Do not rely on the build exit code.** A wrong `outDir` only logs `× Folder '…' doesn't exist` and the build still succeeds without a sitemap. Always check the file.

## Troubleshooting

| Symptom                                                    | Fix                                                                                                                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `× Folder '<dir>/' doesn't exist`                          | Wrong `outDir` for the adapter. Find where the HTML is: `find . -name '*.html' -not -path './node_modules/*' -not -path './.svelte-kit/output/*'`. |
| `× There is no static html file in your '<dir>/' folder`   | Pages aren't prerendered. Add `export const prerender = true`, or list SPA routes in `additional`.                                                 |
| `⚠️ Warning: Only the homepage or fallback page was found` | Other routes aren't prerendered, or not linked from prerendered pages (dynamic routes need `entries` or links).                                    |
| `/404` (or another page) is in the sitemap                 | Add `ignore: ['404.html']` or exclude it in `transform`.                                                                                           |
| No sitemap on SvelteKit 3, no error                        | `svelte-sitemap` older than 4.0.6. Upgrade.                                                                                                        |
| `sitemap.xml` returns 404 on Cloudflare                    | Exclude `/sitemap.xml` from the adapter's `routes`, see [references/adapters.md](references/adapters.md).                                          |
