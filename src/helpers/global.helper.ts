import fg from 'fast-glob';
import fs from 'fs';
import { create } from 'xmlbuilder2';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces.js';
import pkg from '../../package.json' with { type: 'json' };
import { CHANGE_FREQ, CHUNK, OUT_DIR } from '../const.js';
import type { ChangeFreq, Options, OptionsSvelteSitemap, PagesJson } from './../dto/index.js';
import {
  cliColors,
  errorMsgFolder,
  errorMsgHtmlFiles,
  errorMsgWrite,
  successMsg
} from './vars.helper.js';

const version = pkg.version;

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

  // URI-encode each path segment to handle special characters (e.g. spaces → %20).
  // Decode first to avoid double-encoding already percent-encoded segments.
  trimmed = trimmed
    .split('/')
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join('/');

  return `${domain}${slash}${trimmed}`;
};

export const removeHtml = (fileName: string) => {
  if (fileName?.endsWith('.html')) {
    return fileName.slice(0, -5);
  }
  return fileName;
};

export async function prepareData(domain: string, options?: Options): Promise<PagesJson[]> {
  const FOLDER = options?.outDir ?? OUT_DIR;

  const ignore = prepareIgnored(options?.ignore, options?.outDir);
  const changeFreq = prepareChangeFreq(options);
  const pages: string[] = await fg(`${FOLDER}/**/*.html`, { ignore });

  if (options?.additional) pages.push(...options.additional);

  const results: PagesJson[] = [];

  for (const page of pages) {
    const url = getUrl(page, domain, options);
    const pathUrl = getUrl(page, '', options);
    const path = pathUrl.startsWith('/') ? pathUrl : `/${pathUrl}`;

    let item: PagesJson | null = null;

    if (options?.transform) {
      item = await options.transform(options as OptionsSvelteSitemap, path);
    } else {
      item = {
        loc: url,
        page: url,
        changeFreq: changeFreq,
        changefreq: changeFreq,
        lastMod: options?.resetTime ? new Date().toISOString().split('T')[0] : '',
        lastmod: options?.resetTime ? new Date().toISOString().split('T')[0] : ''
      };
    }

    if (item) {
      if (!item.loc) item.loc = item.page;
      if (!item.page) item.page = item.loc;

      if (item.changefreq === undefined && item.changeFreq !== undefined)
        item.changefreq = item.changeFreq;
      if (item.changeFreq === undefined && item.changefreq !== undefined)
        item.changeFreq = item.changefreq;

      if (item.lastmod === undefined && item.lastMod !== undefined) item.lastmod = item.lastMod;
      if (item.lastMod === undefined && item.lastmod !== undefined) item.lastMod = item.lastmod;

      if (item.loc && !item.loc.startsWith('http')) {
        const base = domain.endsWith('/') ? domain.slice(0, -1) : domain;
        if (item.loc.startsWith('/')) {
          item.loc = `${base}${item.loc}`;
        } else {
          const slash = getSlash(domain);
          item.loc = `${domain}${slash}${item.loc}`;
        }
        item.page = item.loc;
      }

      results.push(item);
    }
  }

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
    // fallbacks for backward compatibility
    const loc = item.loc || item.page;
    if (loc) {
      page.ele('loc').txt(loc);
    }

    const changefreq = item.changefreq || item.changeFreq;
    if (changefreq) {
      page.ele('changefreq').txt(changefreq);
    }

    const lastmod = item.lastmod || item.lastMod;
    if (lastmod) {
      page.ele('lastmod').txt(lastmod);
    }

    if (item.priority !== undefined && item.priority !== null) {
      page.ele('priority').txt(item.priority.toString());
    }

    if (item.alternateRefs && Array.isArray(item.alternateRefs)) {
      for (const ref of item.alternateRefs) {
        page.ele('xhtml:link', {
          rel: 'alternate',
          hreflang: ref.hreflang,
          href: ref.href
        });
      }
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
    if (CHANGE_FREQ.includes(options.changeFreq)) {
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
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:xhtml': 'http://www.w3.org/1999/xhtml'
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
