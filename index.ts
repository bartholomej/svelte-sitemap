#!/usr/bin/env node

import minimist from 'minimist';
import { version } from './package.json';
import { createSitemap } from './src/index';

const REPO_URL = 'https://github.com/bartholomej/svelte-sitemap';

let stop = false;

const args = minimist(process.argv.slice(2), {
  string: ['domain', 'debug', 'version'],
  alias: {
    d: 'domain',
    D: 'domain',
    h: 'help',
    H: 'help',
    v: 'version',
    V: 'version',
    r: 'reset-time',
    R: 'reset-time'
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
  log('Static Sitemap generator for SvelteKit');
  log('');
  log(`svelte-sitemap ${version} (check updates: ${REPO_URL})`);
  log('');
  log('Options:');
  log('');
  log('  -d, --domain            Use your domain (eg. https://example.com)');
  log('  -r, --reset-time        Set modified time to now');
  log('  -v, --version           Show version');
  log('  --debug                 Debug mode');
  log(' ');
  process.exit(args.help ? 0 : 1);
} else if (!args.domain) {
  console.log(
    `⚠ svelte-sitemap: --domain argument is required.\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`
  );
  process.exit(0);
} else if (!args.domain.includes('http')) {
  console.log(
    `⚠ svelte-sitemap: --domain argument must starts with https://\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`
  );
  process.exit(0);
} else if (stop) {
  // Do nothing if there is something suspicious
} else {
  const domain = args.domain ? args.domain : undefined;
  const debug = args.debug === '' || args.debug === true ? true : false;
  const resetTime = args['reset-time'] === '' || args['reset-time'] === true ? true : false;
  const options = { debug, resetTime };

  createSitemap(domain, options);
}
