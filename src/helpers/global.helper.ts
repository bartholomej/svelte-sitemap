import fg from 'fast-glob';
import fs from 'fs';
import { create } from 'xmlbuilder2';
import { version } from '../../package.json';
import {
  changeFreq,
  ChangeFreq,
  Options,
  OptionsSvelteSitemap,
  PagesJson
} from '../interfaces/global.interface';
import { APP_NAME, OUT_DIR } from '../vars';
import { cliColors, errorMsg, successMsg } from './vars.helper';

const getUrl = (url: string, domain: string, options: Options) => {
  let slash = domain.split('/').pop() ? '/' : '';

  let trimmed = url
    .split((options?.outDir ?? OUT_DIR) + '/')
    .pop()
    .replace('index.html', '');

  // Remove trailing slashes
  if (!options?.trailingSlashes) {
    trimmed = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
    slash = trimmed ? slash : '';
  }
  return `${domain}${slash}${trimmed}`;
};

export async function prepareData(domain: string, options?: Options): Promise<PagesJson[]> {
  console.log(cliColors.cyanAndBold, `> Using ${APP_NAME}`);

  const ignore = prepareIgnored(options?.ignore, options?.outDir);
  const changeFreq = prepareChangeFreq(options);
  const pages: string[] = await fg(`${options?.outDir ?? OUT_DIR}/**/*.html`, { ignore });

  const results: PagesJson[] = pages.map((page) => {
    return {
      page: getUrl(page, domain, options),
      changeFreq: changeFreq,
      lastMod: options?.resetTime ? new Date().toISOString().split('T')[0] : ''
    };
  });

  return results;
}

export const writeSitemap = (items: PagesJson[], options: Options): void => {
  const sitemap = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  });
  if (options?.attribution) {
    sitemap.com(
      ` This file was automatically generated by https://github.com/bartholomej/svelte-sitemap v${version} `
    );
  }
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

  const outDir = options?.outDir ?? OUT_DIR;

  try {
    fs.writeFileSync(`${outDir}/sitemap.xml`, xml);
    console.log(cliColors.green, successMsg(outDir));
  } catch (e) {
    console.error(cliColors.red, errorMsg(outDir), e);
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

export const mergeOptions = (obj1: any, obj2: any): OptionsSvelteSitemap => {
  const answer: any = {};
  for (const key in obj1) {
    if (answer[key] === undefined || answer[key] === null) answer[key] = obj1[key];
  }
  for (const key in obj2) {
    if (answer[key] === undefined || answer[key] === null) answer[key] = obj2[key];
  }
  return answer;
};
