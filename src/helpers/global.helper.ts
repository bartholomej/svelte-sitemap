import fg from 'fast-glob';
import fs from 'fs';
import { create } from 'xmlbuilder2';
import { Options, PagesJson } from '../interfaces/global.interface';
import { APP_NAME } from '../vars';

const PATH_BUILD = 'build/';

const getUrl = (url: string, domain: string) => {
  const slash = domain.split('/').pop() ? '/' : '';
  const trimmed = url.split(PATH_BUILD).pop().replace('index.html', '');
  return `${domain}${slash}${trimmed}`;
};

export async function prepareData(domain: string, options?: Options): Promise<PagesJson[]> {
  const pages = await fg([`${PATH_BUILD}**/*.html`]);

  const results: PagesJson[] = pages.map((page) => {
    return {
      page: getUrl(page, domain),
      changeFreq: options?.changeFreq ?? '',
      lastMod: options?.resetTime ? new Date().toISOString().split('T')[0] : ''
    };
  });

  return results;
}

export const writeSitemap = (items: PagesJson[]): void => {
  const sitemap = create({ version: '1.0' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  });

  for (const item of items) {
    const page = sitemap.ele('url');
    page.ele('loc').txt(item.page);
    if (item.changeFreq) {
      page.ele('changefreq').txt(item.changeFreq);
    }
    if (item.lastMod) {
      page.ele('lastmod').txt(item.lastMod);
    }
  }
  const xml = sitemap.end({ prettyPrint: true });

  try {
    fs.writeFileSync(`${PATH_BUILD}sitemap.xml`, xml);
    console.log(`${APP_NAME}: sitemap.xml created. Check your build folder...`);
  } catch (e) {
    console.error(
      `ERROR ${APP_NAME}: Make sure you are using this script as 'postbuild' so build folder was sucefully created before this script`,
      e
    );
  }
};
