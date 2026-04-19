[![npm version](https://badge.fury.io/js/svelte-sitemap.svg)](https://badge.fury.io/js/svelte-sitemap)
[![Package License](https://img.shields.io/npm/l/svelte-sitemap.svg)](https://www.npmjs.com/svelte-sitemap)
[![Build & Publish](https://github.com/bartholomej/svelte-sitemap/workflows/Build%20&%20Publish/badge.svg)](https://github.com/bartholomej/svelte-sitemap/actions)

# 🗺️ Svelte `sitemap.xml` generator

**Generates `sitemap.xml` from your SvelteKit static routes — automatically, on every build.**

---

- ➡️ Designed for SvelteKit `adapter-static` with `prerender` option (SSG)
- 🔷 TypeScript, JavaScript, CLI version
- 🔧 Useful [options](#%EF%B8%8F-options) for customizing your sitemap
- 📡 [Ping](#-ping-google-search-console) Google Search Console after deploy
- 🗂️ Support for [sitemap index](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps) for large sites (50K+ pages)
- ▲ 🟠 Works with [Vercel](#-vercel-adapter) and [Cloudflare](#-cloudflare-adapter) adapters and more...

## 📦 Install

```bash
npm install svelte-sitemap --save-dev
# yarn add svelte-sitemap --dev
# pnpm add -D svelte-sitemap
# bun add -d svelte-sitemap
```

## 🚀 Usage

> There are three ways to use this library. Pick the one that suits you best.

### ✨ Method 1: Config file (recommended)

Create a config file `svelte-sitemap.config.ts` in the root of your project:

```typescript
// svelte-sitemap.config.ts
import type { OptionsSvelteSitemap } from 'svelte-sitemap';

const config: OptionsSvelteSitemap = {
  domain: 'https://www.example.com',
  trailingSlashes: true
  // ...more options below
};

export default config;
```

Then add `svelte-sitemap` as a `postbuild` script in `package.json`:

```json
{
  "scripts": {
    "postbuild": "npx svelte-sitemap"
  }
}
```

That's it. After every `build`, the sitemap is automatically generated in your `build/` folder.

---

### ⌨️ Method 2: CLI (legacy)

Pass options directly as CLI flags — no config file needed:

```json
{
  "scripts": {
    "postbuild": "npx svelte-sitemap --domain https://myawesomedomain.com"
  }
}
```

See all available flags in the [Options](#%EF%B8%8F-options) table below.

---

### 🔧 Method 3: JavaScript / TypeScript API

Sometimes it's useful to call the script directly from code:

```typescript
// my-script.js
import { createSitemap } from 'svelte-sitemap';

createSitemap({ domain: 'https://example.com', debug: true });
```

Run your script:

```bash
node my-script.js
```

---

## ⚙️ Options

Options are defined as **config file keys** (camelCase). Use it in your `svelte-sitemap.config.ts` file.
_The same options are also available as **CLI flags** for legacy use._

| Config key        | CLI flag                   | Description                                                                                                         | Default | Example                                     |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------- |
| `domain`          | `--domain`, `-d`           | Your domain **[required]**                                                                                          | -       | `domain: 'https://mydomain.com'`            |
| `outDir`          | `--out-dir`, `-o`          | Custom build folder                                                                                                 | `build` | `outDir: 'dist'`                            |
| `additional`      | `--additional`, `-a`       | Additional pages outside of SvelteKit                                                                               | -       | `additional: ['my-page', 'my-second-page']` |
| `ignore`          | `--ignore`, `-i`           | Ignore files or folders (glob patterns)                                                                             | `[]`    | `ignore: ['**/admin/**', 'my-secret-page']` |
| `trailingSlashes` | `--trailing-slashes`, `-t` | Add trailing slashes                                                                                                | `false` | `trailingSlashes: true`                     |
| `resetTime`       | `--reset-time`, `-r`       | Set lastModified time to now                                                                                        | `false` | `resetTime: true`                           |
| `changeFreq`      | `--change-freq`, `-c`      | Set change frequency [options](https://github.com/bartholomej/svelte-sitemap/blob/master/src/dto/global.dto.ts#L23) | -       | `changeFreq: 'daily'`                       |
| `debug`           | `--debug`                  | Show some useful logs                                                                                               | -       | `debug: true`                               |
| -                 | `--help`, `-h`             | Display usage info                                                                                                  | -       | -                                           |
| -                 | `--version`, `-v`          | Show version                                                                                                        | -       | -                                           |

## 🔄 Transform

The `transform` option gives you full control over each sitemap entry. It receives the config and the page path, and returns a `SitemapField` object (or `null` to skip the page).

This is useful for setting per-page `priority`, `changefreq`, or adding `alternateRefs` for multilingual sites.

```typescript
// svelte-sitemap.config.ts
import type { OptionsSvelteSitemap } from 'svelte-sitemap';

const config: OptionsSvelteSitemap = {
  domain: 'https://example.com',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString().split('T')[0]
    };
  }
};

export default config;
```

### Excluding pages via transform

Return `null` to exclude a page from the sitemap:

```typescript
transform: async (config, path) => {
  if (path.startsWith('/admin')) {
    return null;
  }
  return { loc: path };
};
```

### Alternate refs (hreflang) for multilingual sites

Use `alternateRefs` inside `transform` to add `<xhtml:link rel="alternate" />` entries for each language version of a page. The `xmlns:xhtml` namespace is automatically added to the sitemap only when alternateRefs are present.

```typescript
// svelte-sitemap.config.ts
import type { OptionsSvelteSitemap } from 'svelte-sitemap';

const config: OptionsSvelteSitemap = {
  domain: 'https://example.com',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      alternateRefs: [
        { href: `https://example.com${path}`, hreflang: 'en' },
        { href: `https://es.example.com${path}`, hreflang: 'es' },
        { href: `https://fr.example.com${path}`, hreflang: 'fr' }
      ]
    };
  }
};

export default config;
```

This produces:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://es.example.com/" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://fr.example.com/" />
  </url>
</urlset>
```

> **Tip:** Following Google's guidelines, each URL should include an alternate link pointing to itself as well.

## 🙋 FAQ

### 🙈 How to exclude a directory?

Use `ignore` with glob patterns. For example, to ignore all `admin` folders and one specific page:

```typescript
// svelte-sitemap.config.ts
import type { OptionsSvelteSitemap } from 'svelte-sitemap';

const config: OptionsSvelteSitemap = {
  domain: 'https://www.example.com',
  ignore: ['pages/my-secret-page', '**/admin/**']
};
```

---

### 📡 Ping Google Search Console

Every time you deploy a new version, you can inform Google that there's a new update.
See this [discussion](https://github.com/bartholomej/svelte-sitemap/issues/23) with very useful tips.

---

### ▲ Vercel adapter

If you're using `adapter-vercel`, the output directory is different from the default `build/`:

```typescript
// svelte-sitemap.config.ts
import type { OptionsSvelteSitemap } from 'svelte-sitemap';

const config: OptionsSvelteSitemap = {
  domain: 'https://www.example.com',
  outDir: '.vercel/output/static'
};
```

Or check out [other solutions](https://github.com/bartholomej/svelte-sitemap/issues/16#issuecomment-961414454) and join the discussion.

---

### 🟠 Cloudflare adapter

If you're using `@sveltejs/adapter-cloudflare`, you need to exclude `sitemap.xml` from Cloudflare's routing in `svelte.config.js`:

```diff
-import adapter from '@sveltejs/adapter-auto';
+import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
-       adapter: adapter()
+       adapter: adapter({ routes: { include: ['/*'], exclude: ['<all>', '/sitemap.xml'] }})
    }
};

export default config;
```

---

## 🐞 Common issues

### ❌ Error: Missing folder

```
× Folder 'build/' doesn't exist. Make sure you are using this library as 'postbuild'
  so 'build/' folder was successfully created before running this script.
```

Make sure the output folder exists. If your build outputs to a different folder than `build/`, use the `outDir` option in your config file.

---

### ❌ Error: Missing html files

```
× There is no static html file in your 'build/' folder.
  Are you sure you are using Svelte adapter-static with prerender option?
```

This library is intended for `adapter-static` with the `prerender` option (SSG). If there are no static HTML files in your build folder, this library won't work for you :'(

---

## ⭐️ Show your support

Give a ⭐️ if this project helped you!

Or if you are brave enough consider [making a donation](https://github.com/sponsors/bartholomej) for some 🍺 or 🍵 ;)

## 🕵️ Privacy Policy

I DO NOT STORE ANY DATA. PERIOD.

I physically can't. I have nowhere to store it. I don't even have a server database to store it. So even if Justin Bieber asked nicely to see your data, I wouldn't have anything to show him.

That's why, with this library, what happens on your device stays on your device till disappear.

## 🤝 Contributing

I welcome you to customize this according to your needs ;)

Pull requests for any improvements would be great!

Feel free to check [issues page](https://github.com/bartholomej/svelte-sitemap/issues).

### 🛠️ Developing and debugging this library

```bash
git clone git@github.com:bartholomej/svelte-sitemap.git
cd svelte-sitemap
yarn
yarn start
```

#### Run demo locally

You can find and modify it in [`./demo.ts`](./demo.ts) file

```bash
yarn demo
```

## 🙏 Credits

- svelte-sitemap is a workaround for [this official SvelteKit issue](https://github.com/sveltejs/kit/issues/1142)
- Brand new version is inspired by [Richard's article](https://r-bt.com/learning/sveltekit-sitemap/)
- Thanks to [@auderer](https://github.com/auderer) because [his issue](https://github.com/bartholomej/svelte-sitemap/issues/1) changed the direction of this library

## 📝 License

Copyright &copy; 2026 [Lukas Bartak](http://bartweb.cz)

Proudly powered by nature 🗻, wind 💨, tea 🍵 and beer 🍺 ;)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
