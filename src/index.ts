import { prepareData, writeSitemap } from './helpers/global.helper';
import { cliColors, errorMsg } from './helpers/vars.helper';
import { OptionsSvelteSitemap } from './interfaces/global.interface';

export const createSitemap = async (options: OptionsSvelteSitemap): Promise<void> => {
  if (options?.debug) {
    console.log('OPTIONS', options);
  }

  const json = await prepareData(options.domain, options);

  if (options?.debug) {
    console.log('RESULT', json);
  }

  if (json.length) {
    writeSitemap(json, options);
  } else {
    console.error(cliColors.red, errorMsg(options.outDir));
  }
};
