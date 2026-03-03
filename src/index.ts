import { OUT_DIR } from './const.js';
import { prepareData, writeSitemap } from './helpers/global.helper.js';
import { cliColors, errorMsgWrite } from './helpers/vars.helper.js';
import type { OptionsSvelteSitemap } from './interfaces/global.interface.js';

export const createSitemap = async (options: OptionsSvelteSitemap): Promise<void> => {
  if (options?.debug) {
    console.log('OPTIONS', options);
  }

  const json = await prepareData(options.domain, options);

  if (options?.debug) {
    console.log('RESULT', json);
  }

  if (json.length) {
    writeSitemap(json, options, options.domain);
  } else {
    console.error(cliColors.red, errorMsgWrite(options.outDir ?? OUT_DIR, 'sitemap.xml'));
  }
};
