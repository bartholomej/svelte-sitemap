import { createSitemap } from './src/index';

createSitemap({ domain: 'https://bartweb.cz', debug: false, resetTime: true, outDir: 'build' });
