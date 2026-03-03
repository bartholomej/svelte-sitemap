import { createSitemap } from './src/index';

createSitemap({ domain: 'https://example.com', debug: false, resetTime: true, outDir: 'build' });
