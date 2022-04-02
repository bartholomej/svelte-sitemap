[![npm version](https://badge.fury.io/js/svelte-sitemap.svg)](https://badge.fury.io/js/svelte-sitemap)
[![Package License](https://img.shields.io/npm/l/svelte-sitemap.svg)](https://www.npmjs.com/svelte-sitemap)
[![Build & Publish](https://github.com/bartholomej/svelte-sitemap/workflows/Build%20&%20Publish/badge.svg)](https://github.com/bartholomej/svelte-sitemap/actions)

# Svelte `sitemap.xml` generator

> Small helper which scans your Svelte routes and generates _sitemap.xml_
>
> - Designed for Svelte `adapter-static` with `prerender` option (SSG)
> - TypeScript, JavaScript, CLI version
> - Useful options
> - Workaround for [this official SvelteKit issue](https://github.com/sveltejs/kit/issues/1142)

## Install

```bash
npm install svelte-sitemap --save-dev
# yarn add svelte-sitemap --dev
```

## Usage

> Use this library as a `postbuild` hook in your `package.json` file.

File: `package.json`

```json
{
  "name": "my-awesome-project",
  "scripts": {
    "postbuild": "npx svelte-sitemap --domain https://myawesomedomain.com"
  }
}
```

It scans your routes in `build/` folder and generates `build/sitemap.xml` file.

### Alternative usage: TypeScript or JavaScript method

> Sometimes it can be useful to call the script directly from JavaScript or TypeScript. Of course there is also this option, but in most cases you will need the [CLI method](#cli-method-recommended) as a postbuild hook.

File `my-script.js`:

```typescript
import { createSitemap } from 'svelte-sitemap/src/index.js';

createSitemap('https://example.com', { debug: true });
```

And now you can run your script like this: `node my-script.js`

## ⚙️ Options

| Option                     | Description                                                                                                                     | Default | Example                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------- |
| `--domain`, `-d`           | Use your domain **[required]**                                                                                                  | -       | `-d https://mydomain.com`              |
| `--out-dir`, `-o`          | Set custom build folder                                                                                                         | `build` | `-o dist`                              |
| `--ignore`, `-i`           | Ignore files or folders                                                                                                         | []      | `-i '**/admin/**' -i 'my-secret-page'` |
| `--trailing-slashes`, `-t` | Add trailing slashes                                                                                                            | false   | `--trailing-slashes`                   |
| `--reset-time`, `-r`       | Set lastModified time to now                                                                                                    | false   | `-r`                                   |
| `--change-freq`, `-c`      | Set change frequency [Option](https://github.com/bartholomej/svelte-sitemap/blob/master/src/interfaces/global.interface.ts#L22) | -       | `--change-freq daily`                  |
| `--help`, `-h`             | Display this usage info                                                                                                         | -       | `-v`                                   |
| `--version`, `-v`          | Show version                                                                                                                    | -       | `-h`                                   |
| `--debug`                  | Show some useful logs                                                                                                           | -       | `--debug`                              |

## 🙋 FAQ

### How to exclude directory?

> Let's say we want to ignore all `admin` folders and subfolders + just one exact page `pages/my-secret-page`

```bash
npx svelte-sitemap --domain https://www.example.com --ignore 'pages/my-secret-page' --ignore '**/admin/**'
```

### Ping Google Search Console

> Every time I deploy a new version, I want to inform Google that there is a new update.

See this [discussion](https://github.com/bartholomej/svelte-sitemap/issues/23) with very useful tips.

### Error: Missing folder

> × Folder 'build/' doesn't exist. Make sure you are using this library as 'postbuild' so 'build/' folder was successfully created before running this script.

- Make sure your output folder exists. If it has other name than the default `build`, you can use the `outDir` `(--out-dir)` option.
- If you are using Vercel hosting and adapter-vercel, look at [this solution](https://github.com/bartholomej/svelte-sitemap/issues/16#issuecomment-961414454).

### Error: Missing html files

> × There is no static html file in your 'build/' folder. Are you sure you are using Svelte adapter-static with prerender option?

This library is intended for the static adapter and `prerender` option (SSG). So if there are no static files, then my library will not work for you :/

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

## 🙏 Credits

- svelte-sitemap is workaround for [this official SvelteKit issue](https://github.com/sveltejs/kit/issues/1142)
- Brand new version is inspired by [Richard's article](https://r-bt.com/learning/sveltekit-sitemap/)
- Thanks to [@auderer](https://github.com/auderer) because [his issue](https://github.com/bartholomej/svelte-sitemap/issues/1) changed the direction of this library

## 📝 License

Copyright &copy; 2022 [Lukas Bartak](http://bartweb.cz)

Proudly powered by nature 🗻, wind 💨, tea 🍵 and beer 🍺 ;)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
