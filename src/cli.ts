#!/usr/bin/env node
import minimist from 'minimist';
import pkg from './../package.json' with { type: 'json' };
import { APP_NAME, CONFIG_FILES, REPO_URL } from './const.js';
import type { ChangeFreq, OptionsSvelteSitemap } from './dto/index.js';
import { defaultConfig, loadConfig, withDefaultConfig } from './helpers/config.js';
import { cliColors, errorMsgGeneration } from './helpers/vars.helper.js';
import { createSitemap } from './index.js';
const version = pkg.version;

const main = async () => {
  console.log(cliColors.cyanAndBold, `> Using ${APP_NAME}`);

  let stop = false;

  const config = await loadConfig(CONFIG_FILES);

  const args = minimist(process.argv.slice(2), {
    string: ['domain', 'out-dir', 'ignore', 'change-freq', 'additional'],
    boolean: ['attribution', 'reset-time', 'trailing-slashes', 'debug', 'version'],
    default: { attribution: true, 'trailing-slashes': false, default: false },
    alias: {
      d: 'domain',
      D: 'domain',
      h: 'help',
      H: 'help',
      v: 'version',
      V: 'version',
      O: 'out-dir',
      o: 'out-dir',
      r: 'reset-time',
      R: 'reset-time',
      c: 'change-freq',
      C: 'change-freq',
      i: 'ignore',
      I: 'ignore',
      t: 'trailing-slashes',
      T: 'trailing-slashes',
      a: 'additional',
      A: 'additional'
    },
    unknown: (err: string) => {
      if (config && Object.keys(config).length > 0) return false;
      console.log(cliColors.yellow, '  ⚠ This argument is not supported:', err);
      // console.log(cliColors.yellow, '  Use: `svelte-sitemap --help` for more options.');
      stop = true;
      return false;
    }
  });

  if (args.help || args.version === '' || args.version === true) {
    const log = args.help ? console.log : console.error;
    log('Svelte `sitemap.xml` generator');
    log('');
    log(`svelte-sitemap ${version} (check updates: ${REPO_URL})`);
    log('');
    log('Options:');
    log('');
    log('  -d, --domain            Use your domain (eg. https://example.com)');
    log('  -o, --out-dir           Custom output dir');
    log('  -i, --ignore            Exclude some pages or folders');
    log('  -a, --additional        Additional pages outside of SvelteKit (e.g. /, /contact)');
    log('  -t, --trailing-slashes  Do you like trailing slashes?');
    log('  -r, --reset-time        Set modified time to now');
    log('  -c, --change-freq       Set change frequency `weekly` | `daily` | …');
    log('  -v, --version           Show version');
    log('  --debug                 Debug mode');
    log(' ');
    process.exit(args.help ? 0 : 1);
  } else if (config && Object.keys(config).length > 0) {
    // --- CONFIG FILE PATH ---
    const hasCliOptions = process.argv.slice(2).length > 0;
    console.log(cliColors.green, `  ✔ Reading config file...`);

    const allowedKeys = Object.keys(defaultConfig);
    const invalidKeys = Object.keys(config).filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      console.log(
        cliColors.yellow,
        `  ⚠ Invalid properties in config file, so I ignore them: ${invalidKeys.join(', ')}`
      );
    }

    if (hasCliOptions) {
      console.log(
        cliColors.yellow,
        `  ⚠ You have also set CLI options (arguments with '--'), but they are ignored because your config file 'svelte-sitemap.config.ts' is used.`
      );
    }

    if (!config.domain) {
      console.log(
        cliColors.yellow,
        `  ⚠ svelte-sitemap: 'domain' property is required in your config file. See instructions: ${REPO_URL}\n`
      );
      console.error(cliColors.red, errorMsgGeneration);
      process.exit(0);
    }

    if (!config.domain.includes('http')) {
      console.log(
        cliColors.yellow,
        `  ⚠ svelte-sitemap: 'domain' property in your config file must start with https:// See instructions: ${REPO_URL}\n`
      );
      console.error(cliColors.red, errorMsgGeneration);
      process.exit(0);
    }

    try {
      await createSitemap(withDefaultConfig(config));
    } catch (err) {
      console.error(cliColors.red, errorMsgGeneration, err);
      process.exit(0);
    }
  } else {
    // --- CLI ARGUMENTS PATH ---
    if (stop) {
      console.error(cliColors.red, errorMsgGeneration);
      process.exit(0);
    }

    if (!args.domain) {
      console.log(
        cliColors.red,
        `  ⚠ svelte-sitemap: --domain argument is required. See instructions: ${REPO_URL}\n  Example:\n    svelte-sitemap --domain https://mydomain.com\n`
      );
      console.error(cliColors.red, errorMsgGeneration);
      process.exit(0);
    }

    if (!args.domain.includes('http')) {
      console.log(
        cliColors.red,
        `  ⚠ svelte-sitemap: --domain argument must start with https:// See instructions: ${REPO_URL}\n  Example:\n\n    svelte-sitemap --domain https://mydomain.com\n`
      );
      console.error(cliColors.red, errorMsgGeneration);
      process.exit(0);
    }

    const domain: string = args.domain;
    const debug: boolean = args.debug === '' || args.debug === true ? true : false;
    const additional = Array.isArray(args['additional'])
      ? args['additional']
      : args.additional
        ? [args.additional]
        : [];
    const resetTime: boolean =
      args['reset-time'] === '' || args['reset-time'] === true ? true : false;
    const trailingSlashes: boolean =
      args['trailing-slashes'] === '' || args['trailing-slashes'] === true ? true : false;
    const changeFreq: ChangeFreq = args['change-freq'];
    const outDir: string = args['out-dir'];
    const ignore: string = args['ignore'];
    const attribution: boolean =
      args['attribution'] === '' || args['attribution'] === false ? false : true;

    const optionsCli: OptionsSvelteSitemap = {
      debug,
      resetTime,
      changeFreq,
      outDir,
      domain,
      attribution,
      ignore,
      trailingSlashes,
      additional
    };

    console.log(
      cliColors.yellow,
      `  ℹ Hint: Configuration file is now the preferred method to set up svelte-sitemap. See ${REPO_URL}?tab=readme-ov-file#-usage`
    );
    console.log(cliColors.cyanAndBold, `  ✔ Using CLI options. Config file not found.`);
    try {
      await createSitemap(optionsCli);
    } catch (err) {
      console.error(cliColors.red, errorMsgGeneration, err);
      process.exit(0);
    }
  }
};

main();
