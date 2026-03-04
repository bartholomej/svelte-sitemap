import { OUT_DIR } from '../const.js';
import type { OptionsSvelteSitemap } from '../dto/index.js';
import { loadFile } from './file.js';

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
