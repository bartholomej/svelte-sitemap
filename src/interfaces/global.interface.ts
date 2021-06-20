export interface Arguments {
  domain: string;
  options?: Options;
}

export interface Options {
  debug?: boolean;
  changeFreq?: ChangeFreq;
  resetTime?: boolean;
}

export interface PagesJson {
  page: string;
  changeFreq?: ChangeFreq;
  lastMod?: string;
}

type ChangeFreq = 'weekly' | 'daily' | string;
