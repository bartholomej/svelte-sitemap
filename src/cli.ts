#!/usr/bin/env node
import minimist from 'minimist';
import pkg from '../package.json' with { type: 'json' };
import { loadConfig, withDefaultConfig } from './helpers/config.js';
import { cliColors } from './helpers/vars.helper.js';
import { createSitemap } from './index.js';
import type { ChangeFreq, OptionsSvelteSitemap } from './interfaces/global.interface.js';
import { APP_NAME, CONFIG_FILES } from './vars.js';
const version = pkg.version;

const main = async () => {
  console.log(cliColors.cyanAndBold, `> Using ${APP_NAME}`);

  const REPO_URL = 'https://github.com/bartholomej/svelte-sitemap';

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
      console.log('⚠ Those arguments are not supported:', err);
      console.log('Use: `svelte-sitemap --help` for more options.\n');
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
  } else if (!config?.domain && !args.domain) {
    console.log(
      `⚠ svelte-sitemap: --domain argument is required.\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`
    );
    process.exit(0);
  } else if (!config?.domain?.includes('http') && !args.domain?.includes('http')) {
    console.log(
      `⚠ svelte-sitemap: --domain argument must starts with https://\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`
    );
    process.exit(0);
  } else if (stop) {
    // Do nothing if there is something suspicious
  } else {
    const domain: string = args.domain ? args.domain : undefined;
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

    if (config === undefined || Object.keys(config).length === 0) {
      console.log(
        cliColors.yellow,
        `  ℹ Hint: Configuration file is now the preferred method to set up svelte-sitemap. See ${REPO_URL}`
      );
      console.log(cliColors.cyanAndBold, `  ✔ Using CLI options. Config file not found.`);
      createSitemap(optionsCli);
    } else {
      console.log(cliColors.green, `  ✔ Loading config file. CLI options are ignored now.`);
      createSitemap(withDefaultConfig(config));
    }
  }
};

main();
