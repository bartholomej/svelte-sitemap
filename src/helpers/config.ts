import { OptionsSvelteSitemap } from '../interfaces/global.interface';
import { OUT_DIR } from './../vars';
import { loadFile } from './file';

export const loadConfig = (path: string): OptionsSvelteSitemap => {
  const baseConfig = loadFile<OptionsSvelteSitemap>(path);
  return withDefaultConfig(baseConfig!);
};

export const defaultConfig: OptionsSvelteSitemap = {
  debug: false,
  changeFreq: null,
  resetTime: false,
  outDir: OUT_DIR,
  attribution: true,
  ignore: null,
  trailingSlashes: false,
  domain: null
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
