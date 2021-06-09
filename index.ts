#!/usr/bin/env node

import minimist from 'minimist';
import { version } from './package.json';
import { createSitemap } from './src/index';

let stop = false;

const args = minimist(process.argv.slice(2), {
  string: ['domain', 'debug'],
  alias: { d: 'domain', h: 'help' },
  unknown: (err: string) => {
    console.log('Those arguments are not supported:', err);
    console.log('Use: `svelte-sitemap --help` for more options.');
    stop = true;
    return false;
  }
});

if (args.help) {
  const log = args.help ? console.log : console.error;
  log(`Usage: svelte-sitemap ${version}`);
  log('');
  log('  Static Sitemap generator for SvelteKit');
  log('');
  log('Options:');
  log('');
  log('  -d, --domain            Use your domain (eg. https://example.com)');
  log('  -debug                  Debug mode');
  log(' ');
  process.exit(args.help ? 0 : 1);
} else if (args.version) {
  console.log(`svelte-sitemap v${version}`);
} else if (stop) {
  // Do nothing if there is something suspicious
} else {
  const domain = args.domain ? args.domain : undefined;
  const debug = args.debug === '' || args.debug === true ? true : false;
  const options = { debug };

  createSitemap(domain, options);
}
