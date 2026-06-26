# `transform`: per-page control

Requires `svelte-sitemap` 4.1.0+. Works in the Vite plugin, `svelte-sitemap.config.ts` and the JS API (not as a CLI flag).

```ts
transform: (config, path) => SitemapField | null | undefined | Promise<…>
```

- `config`: the options passed to `svelteSitemap()`, e.g. `config.domain`.
- `path`: the page path without the domain: `/`, `/about`, `/blog/my-post` (`/about/` with `trailingSlashes: true`). Pages from `additional` are passed too.
- Return an object with only the fields to change. It is **merged with the defaults** (`changeFreq`, `lastmod` from `resetTime`).
- Return `undefined` (nothing) to keep the page unchanged, `null` to exclude it.
- Can be `async`.
- The recipes below don't return anything for pages they don't change. If the project's tsconfig has `noImplicitReturns`, that's error TS7030; end the function with `return undefined;`.

| Field           | Meaning                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------ |
| `loc`           | Page URL. A relative path (`/about-us`) gets the domain prepended; absolute URLs are kept. |
| `lastmod`       | Last modification date, e.g. `'2026-10-09'`.                                               |
| `changefreq`    | `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.                       |
| `priority`      | `0.0` to `1.0`.                                                                            |
| `alternateRefs` | `[{ href, hreflang }]`, rendered as `<xhtml:link rel="alternate">`.                        |

Field names follow the sitemap XML tags (`changefreq`, `lastmod`), unlike the `changeFreq` option.

## Recipes

All recipes show the `svelteSitemap()` call from `vite.config.ts`.

### Priority and change frequency per section

```ts
svelteSitemap({
  domain: 'https://example.com',
  transform: (config, path) => {
    if (path === '/') return { priority: 1.0, changefreq: 'daily' };
    if (path.startsWith('/blog')) return { priority: 0.8, changefreq: 'weekly' };
  }
});
```

### Exclude pages

```ts
svelteSitemap({
  domain: 'https://example.com',
  transform: (config, path) => {
    if (path === '/404' || path === '/admin' || path.startsWith('/admin/')) return null;
  }
});
```

Use this when the decision needs logic (prefixes, data). For plain names, `ignore: ['404', 'admin']` does the same since 4.1.1; older versions don't match flat page files like `build/admin.html` with `ignore`, but `transform` works on any version.

### `lastmod` from a CMS or content files

```ts
let posts;

svelteSitemap({
  domain: 'https://example.com',
  transform: async (config, path) => {
    posts ??= await getPosts(); // the project's own data source, loaded once
    const post = posts.find((p) => path === `/blog/${p.slug}`);
    if (post) return { lastmod: post.updatedAt.slice(0, 10) };
  }
});
```

### Multilingual sites (hreflang)

For routes like `/en/...` and `/de/...`, every language version lists itself, the other languages and `x-default`:

```ts
const locales = ['en', 'de'];

svelteSitemap({
  domain: 'https://example.com',
  transform: (config, path) => {
    const [, locale, ...rest] = path.split('/');
    if (!locales.includes(locale)) return;
    const subpath = rest.length ? `/${rest.join('/')}` : '';
    return {
      alternateRefs: [
        ...locales.map((l) => ({ hreflang: l, href: `${config.domain}/${l}${subpath}` })),
        { hreflang: 'x-default', href: `${config.domain}/en${subpath}` }
      ]
    };
  }
});
```

`xmlns:xhtml` is added to `<urlset>` automatically when any page has `alternateRefs`.

## Typing

`SitemapField` is exported for typed helpers:

```ts
import type { SitemapField } from 'svelte-sitemap';
```
