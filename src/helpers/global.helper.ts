import fs, { writeFile } from 'fs';
import { Options } from 'interfaces/global.interface';
import path from 'path';
import xml from 'xml';

interface Page {
  title: string;
  lastModified: string;
  slug: string;
  created: string;
}
const ROUTES = 'src/routes';

/**
 * Main wrapper
 * @param {string} domain Your domain
 */
export const buildSitemap = (domain: string, options: Options): void => {
  const files = getFiles(options);
  assembleXML(files, domain, options);
};

const walkSync = (dir: string, filelist: string[] = []) => {
  fs.readdirSync(dir).forEach((file) => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

/**
 * Gathering files from subolders
 * @param {string} options some options
 */
export const getFiles = (options: Options): Page[] => {
  const pages: Page[] = [];

  const paths = walkSync(ROUTES);

  if (!paths?.length) {
    console.error(
      'No routes found in you project... Make sure you have this folder created:',
      ROUTES
    );
    return [];
  }

  paths.forEach((route) => {
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

  if (options?.debug) {
    console.log('pages', pages);
  }
  return pages;
};

/**
 * Assemble xml and create file
 * @param {string[]} pages List of pages
 * @param {string} domain Your domain
 * @param {string} options Some useful options
 */
export const assembleXML = (pages: Page[], domain: string, options: Options) => {
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

  writeFile('./static/sitemap.xml', sitemap, (err) => {
    if (!err) {
      console.log('\x1b[32m', `File './static/sitemap.xml' has been created.`, '\x1b[0m');
    }
  });
};
