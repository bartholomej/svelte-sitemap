[![npm version](https://badge.fury.io/js/svelte-sitemap.svg)](https://badge.fury.io/js/svelte-sitemap)
[![Package License](https://img.shields.io/npm/l/svelte-sitemap.svg)](https://www.npmjs.com/svelte-sitemap)
[![Build & Publish](https://github.com/bartholomej/svelte-sitemap/workflows/Build%20&%20Publish/badge.svg)](https://github.com/bartholomej/svelte-sitemap/actions)

# Svelte static sitemap.xml generator [beta]

> Small helper which scans your Svelte routes folder and generates static sitemap.xml
>
> - TypeScript, JavaScript, CLI version
> - Useful options
> - Workaround for [official SvelteKit issue](https://github.com/sveltejs/kit/issues/1142)

## Install

via yarn

```bash
yarn add svelte-sitemap --dev
```

via npm

```bash
npm install svelte-sitemap --save-dev
```

## Usage

### CLI

```bash
svelte-sitemap --domain https://example.com
```

It scans your `src/routes/` folder and generates `static/sitemap.xml` file

### JavaScript

```javascript
import { createSitemap } from './src/index';

createSitemap('https://example.com', { debug: true });
```

## Example

Highly recommended to use as `prebuild` hook in you `package.json`

```json
{
  "name": "my-project",
  "scripts": {
    "prebuild": "svelte-sitemap --domain https://mydomain.com"
  }
}
```

## Options

| Option        | Description                | default               | example                   |
| ------------- | -------------------------- | --------------------- | ------------------------- |
| -h, --help    | Display this usage info    | -                     | -                         |
| -v, --version | Show version               | -                     | -                         |
| -d, --domain  | Use your domain (required) | `https://example.com` | `-d https://mydomain.com` |
| --debug       | Show some useful logs      | -                     | `--debug`                 |

## Development

I welcome you to customize this according to your needs ;)

Pull requests for any improvements would be great!

### Developing and debugging this library

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

## Donation

If this project have helped you save time please consider [making a donation](https://github.com/sponsors/bartholomej) for some 🍺 or 🍵 ;)

## Privacy Policy

I DO NOT STORE ANY DATA. PERIOD.

I physically can't. I have nowhere to store it. I don't even have a server database to store it. So even if Justin Bieber asked nicely to see your data, I wouldn't have anything to show him.

That's why, with this library, what happens on your device stays on your device till disappear.

## License

Copyright &copy; 2021 [Lukas Bartak](http://bartweb.cz)

Proudly powered by nature 🗻, wind 💨, tea 🍵 and beer 🍺 ;)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
