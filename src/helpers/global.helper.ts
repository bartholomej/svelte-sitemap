import { writeFile } from 'fs';
import glob from 'glob';
import { Options } from 'interfaces/global.interface';
import { promisify } from 'util';
import xml from 'xml';

interface Page {
  title: string;
  lastModified: string;
  slug: string;
  created: string;
}
const ROUTES = 'src/routes';

const writeFileAsync = promisify(writeFile);

/**
 * Main wrapper
 * @param {string} domain Your domain
 */
export const buildSitemap = (domain: string, options: Options): void => {
  gatherFiles(domain, options);
};

/**
 * Gathering files from subolders
 * @param {string} domain Your domain
 */
const gatherFiles = (domain: string, opt: Options) => {
  glob(`${ROUTES}/**/*`, (err: any, res: string[]): void => {
    if (err) {
      console.error('Error reading files', err);
    } else {
      if (!res?.length) {
        console.error(
          'No routes found in you project... Make sure you have this folder created:',
          ROUTES
        );
        return;
      }
      const pages: Page[] = [];
      res.forEach((route) => {
        const splitted = route.split('/');
        const routesCleaned = splitted.splice(2, 5).join('/');
        // Excluding svelte files
        const slug = routesCleaned.replace('/index.svelte', '').replace('.svelte', '');
        if (slug !== 'index' && slug.includes('__') === false) {
          pages.push({
            lastModified: new Date().toISOString().slice(0, 10),
            title: slug,
            created: new Date().toISOString().slice(0, 10),
            slug
          });
        }
      });
      if (opt?.debug) {
        console.log('pages', pages);
      }
      assembleXML(pages, domain, opt);
    }
  });
};
/**
 * Assemble xml and create file
 * @param {string[]} pages List of pages
 * @param {string} domain Your domain
 * @param {string} options Some useful options
 */
export const assembleXML = async (pages: Page[], domain: string, options: Options) => {
  const indexItem = {
    // build index item
    url: [
      {
        loc: domain
      },
      {
        lastmod: new Date(
          Math.max.apply(
            null,
            pages.map((page) => {
              return new Date(page.lastModified ?? page.created) as unknown as number;
            })
          )
        )
          .toISOString()
          .split('T')[0]
      },
      { changefreq: 'daily' },
      { priority: '1.0' }
    ]
  };

  const sitemapItems = pages.reduce(
    (
      items: { url: [{ loc: string }, { lastmod: string }] }[],
      item: {
        title: string;
        lastModified?: string;
        created: string;
        slug: string;
      }
    ) => {
      // build page items
      items.push({
        url: [
          {
            loc: `${domain}/${item.slug}`
          },
          {
            lastmod: new Date(item.lastModified ?? item.created).toISOString().split('T')[0]
          }
        ]
      });
      return items;
    },
    []
  );

  const sitemapObject = {
    urlset: [
      {
        _attr: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
        }
      },
      indexItem,
      ...sitemapItems
    ]
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>${xml(sitemapObject)}`;

  await writeFileAsync('./static/sitemap.xml', sitemap, 'utf8');
  console.log('\x1b[32m', `File './static/sitemap.xml' has been created.`, '\x1b[0m');
};
