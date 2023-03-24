import fg from 'fast-glob';
import fs from 'fs';
import { create } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { version } from '../../package.json';
import { changeFreq, ChangeFreq, Options, PagesJson } from '../interfaces/global.interface';
import { APP_NAME, CHUNK, OUT_DIR } from '../vars';
import {
  cliColors,
  errorMsgFolder,
  errorMsgHtmlFiles,
  errorMsgWrite,
  successMsg
} from './vars.helper';

const getUrl = (url: string, domain: string, options: Options) => {
  let slash: '' | '/' = getSlash(domain);

  let trimmed = url
    .split((options?.outDir ?? OUT_DIR) + '/')
    .pop()
    .replace('index.html', '');

  trimmed = removeHtml(trimmed);

  // Add all traling slashes
  if (options?.trailingSlashes) {
    trimmed = trimmed.length && !trimmed.endsWith('/') ? trimmed + '/' : trimmed;
  } else {
    trimmed = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
    slash = trimmed ? slash : '';
  }
  return `${domain}${slash}${trimmed}`;
};

const getPriority = (pageUrl: string) => {
  let PRIOR = 1.0;
  const url = new URL(pageUrl);
  let sliced = url.pathname.split('/').slice(1);
  sliced.forEach((slice) => {
    if (slice != '') {
      if (PRIOR >= 0.2) {
        PRIOR -= 0.2;
      }
    }
  });

  if (PRIOR == 1) {
    return '1.0';
  }
  if (PRIOR == 0) {
    return null;
  }
  return String(Math.round(PRIOR * 10) / 10);
};

export const removeHtml = (fileName: string) => {
  if (fileName?.endsWith('.html')) {
    return fileName.slice(0, -5);
  }
  return fileName;
};

export async function prepareData(domain: string, options?: Options): Promise<PagesJson[]> {
  console.log(cliColors.cyanAndBold, `> Using ${APP_NAME}`);

  const FOLDER = options?.outDir ?? OUT_DIR;

  const ignore = prepareIgnored(options?.ignore, options?.outDir);
  const changeFreq = prepareChangeFreq(options);
  const pages: string[] = await fg(`${FOLDER}/**/*.html`, { ignore });

  const results = pages.map((page) => {
    const pageUrl = getUrl(page, domain, options);
    return {
      page: pageUrl,
      changeFreq: changeFreq,
      lastMod: options?.resetTime ? new Date().toISOString().split('T')[0] : '',
      priority: options?.priority ? getPriority(pageUrl) : null
    };
  });

  detectErrors({
    folder: !fs.existsSync(FOLDER),
    htmlFiles: !pages.length
  });

  return results;
}

export const detectErrors = ({ folder, htmlFiles }: { folder: boolean; htmlFiles: boolean }) => {
  if (folder && htmlFiles) {
    console.error(cliColors.red, errorMsgFolder(OUT_DIR));
  } else if (htmlFiles) {
    // If no page exists, then the static adapter is probably not used
    console.error(cliColors.red, errorMsgHtmlFiles(OUT_DIR));
  }
};

export const writeSitemap = (items: PagesJson[], options: Options, domain: string): void => {
  const outDir = options?.outDir ?? OUT_DIR;

  if (items?.length <= CHUNK.maxSize) {
    createFile(items, options, outDir);
  } else {
    // If the number of pages is greater than the chunk size, then we split the sitemap into multiple files
    // and create an index file that links to all of them
    // https://support.google.com/webmasters/answer/183668?hl=en
    const numberOfChunks = Math.ceil(items.length / CHUNK.maxSize);

    console.log(
      cliColors.cyanAndBold,
      `> Oh, your site is huge! Writing sitemap in chunks of ${numberOfChunks} pages and its index sitemap.xml`
    );

    for (let i = 0; i < items.length; i += CHUNK.maxSize) {
      const chunk = items.slice(i, i + CHUNK.maxSize);
      createFile(chunk, options, outDir, i / CHUNK.maxSize + 1);
    }
    createIndexFile(numberOfChunks, outDir, options, domain);
  }
};

const createFile = (
  items: PagesJson[],
  options: Options,
  outDir: string,
  chunkId?: number
): void => {
  const sitemap = createXml('urlset');
  addAttribution(sitemap, options);

  for (const item of items) {
    const page = sitemap.ele('url');
    page.ele('loc').txt(item.page);
    if (item.changeFreq) {
      page.ele('changefreq').txt(item.changeFreq);
    }
    if (item.lastMod) {
      page.ele('lastmod').txt(item.lastMod);
    }
    if (item.priority) {
      page.ele('priority').txt(item.priority);
    }
  }

  const xml = finishXml(sitemap);

  const fileName = chunkId ? `sitemap-${chunkId}.xml` : 'sitemap.xml';

  try {
    fs.writeFileSync(`${outDir}/${fileName}`, xml);
    console.log(cliColors.green, successMsg(outDir, fileName));
  } catch (e) {
    console.error(cliColors.red, errorMsgWrite(outDir, fileName), e);
  }
};

const createIndexFile = (
  numberOfChunks: number,
  outDir: string,
  options: Options,
  domain: string
): void => {
  const FILENAME = 'sitemap.xml';
  const slash = getSlash(domain);

  const sitemap = createXml('sitemapindex');
  addAttribution(sitemap, options);

  for (let i = 1; i <= numberOfChunks; i++) {
    sitemap.ele('sitemap').ele('loc').txt(`${domain}${slash}sitemap-${i}.xml`);
  }

  const xml = finishXml(sitemap);

  try {
    fs.writeFileSync(`${outDir}/${FILENAME}`, xml);
    console.log(cliColors.green, successMsg(outDir, FILENAME));
  } catch (e) {
    console.error(cliColors.red, errorMsgWrite(outDir, FILENAME), e);
  }
};

const prepareIgnored = (
  ignored: string | string[],
  outDir: string = OUT_DIR
): string[] | undefined => {
  let ignore: string[] | undefined;
  if (ignored) {
    ignore = Array.isArray(ignored) ? ignored : [ignored];
    ignore = ignore.map((ignoredPage) => `${outDir}/${ignoredPage}`);
  }
  return ignore;
};

const prepareChangeFreq = (options: Options): ChangeFreq => {
  let result: ChangeFreq = null;

  if (options?.changeFreq) {
    if (changeFreq.includes(options.changeFreq)) {
      result = options.changeFreq;
    } else {
      console.log(
        cliColors.red,
        `  × Option \`--change-freq ${options.changeFreq}\` is not a valid value. See docs: https://github.com/bartholomej/svelte-sitemap#options`
      );
    }
  }
  return result;
};

const getSlash = (domain: string) => (domain.split('/').pop() ? '/' : '');

const createXml = (elementName: 'urlset' | 'sitemapindex'): XMLBuilder => {
  return create({ version: '1.0', encoding: 'UTF-8' }).ele(elementName, {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  });
};

const finishXml = (sitemap: XMLBuilder): string => {
  return sitemap.end({ prettyPrint: true });
};

const addAttribution = (sitemap: XMLBuilder, options: Options): void => {
  if (options?.attribution !== false) {
    sitemap.com(
      ` This file was automatically generated by https://github.com/bartholomej/svelte-sitemap v${version} `
    );
  }
};
