import { CHANGE_FREQ } from '../const.js';

export interface Arguments {
  domain: string;
  options?: Options;
}

export interface Options {
  debug?: boolean;
  changeFreq?: ChangeFreq;
  resetTime?: boolean;
  outDir?: string;
  attribution?: boolean;
  ignore?: string | string[];
  trailingSlashes?: boolean;
  additional?: string[];
  transform?: (
    config: OptionsSvelteSitemap,
    path: string
  ) => Promise<SitemapField | null> | SitemapField | null;
}

export interface OptionsSvelteSitemap extends Options {
  domain: string;
}

export interface SitemapFieldAlternateRef {
  href: string;
  hreflang: string;
}

export interface SitemapField {
  loc: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: number | string;
  alternateRefs?: Array<SitemapFieldAlternateRef>;
}

export interface PagesJson {
  page?: string;
  changeFreq?: ChangeFreq;
  lastMod?: string;
}

/**
 * Specs: https://www.sitemaps.org/protocol.html
 */
export type ChangeFreq = (typeof CHANGE_FREQ)[number];
