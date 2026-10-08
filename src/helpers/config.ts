import { OUT_DIR, REPO_URL } from '../const.js';
import type { OptionsSvelteSitemap } from '../dto/index.js';
import { loadFile } from './file.js';
import { cliColors } from './vars.helper.js';

export const loadConfig = async (paths: string[]): Promise<OptionsSvelteSitemap | undefined> => {
  for (const path of paths) {
    const config = await loadFile<OptionsSvelteSitemap>(path, false);
    if (config) {
      return config;
    }
  }
  return undefined;
};

export const defaultConfig: OptionsSvelteSitemap = {
  debug: false,
  changeFreq: null,
  resetTime: false,
  outDir: OUT_DIR,
  additional: null,
  attribution: true,
  ignore: null,
  trailingSlashes: false,
  domain: null,
  transform: null
};

export const updateConfig = (
  currConfig: OptionsSvelteSitemap,
  newConfig: OptionsSvelteSitemap
): OptionsSvelteSitemap => {
  return { ...currConfig, ...newConfig };
};

export const withDefaultConfig = (config: OptionsSvelteSitemap): OptionsSvelteSitemap => {
  return updateConfig(defaultConfig, config);
};

export const validateOptions = (options: OptionsSvelteSitemap): OptionsSvelteSitemap => {
  const domain = options?.domain;

  if (!domain || typeof domain !== 'string') {
    throw new Error(
      `svelte-sitemap: 'domain' option is required, e.g. { domain: 'https://example.com' }. See ${REPO_URL}`
    );
  }

  if (!/^https?:\/\//.test(domain) || !URL.canParse(domain)) {
    console.log(
      cliColors.yellow,
      `  ⚠ Option 'domain' should be a full URL, e.g. 'https://example.com'. Got '${domain}'.`
    );
  }

  const unknownKeys = Object.keys(options).filter((key) => !(key in defaultConfig));
  if (unknownKeys.length > 0) {
    console.log(
      cliColors.yellow,
      `  ⚠ Unknown options, so I ignore them: ${unknownKeys.join(', ')}`
    );
  }

  if (typeof options.additional === 'string') {
    return { ...options, additional: [options.additional] };
  }

  return options;
};
