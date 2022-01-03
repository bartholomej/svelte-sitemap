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
}

export interface PagesJson {
  page: string;
  changeFreq?: ChangeFreq;
  lastMod?: string;
}

/**
 * Specs: https://www.sitemaps.org/protocol.html
 */
export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
