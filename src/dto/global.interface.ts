import { CHANGE_FREQ, IntegrationMethod } from '../const.js';

export type { IntegrationMethod };

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
}

export interface OptionsSvelteSitemap extends Options {
  domain: string;
}

export interface PagesJson {
  page: string;
  changeFreq?: ChangeFreq;
  lastMod?: string;
}

/**
 * Specs: https://www.sitemaps.org/protocol.html
 */
export type ChangeFreq = (typeof CHANGE_FREQ)[number];
