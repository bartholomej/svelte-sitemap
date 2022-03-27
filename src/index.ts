import { prepareData, writeSitemap } from './helpers/global.helper';
import { cliColors, errorMsgWrite } from './helpers/vars.helper';
import { Options } from './interfaces/global.interface';
import { DOMAIN, OUT_DIR } from './vars';

export const createSitemap = async (domain: string = DOMAIN, options?: Options): Promise<void> => {
  if (options?.debug) {
    console.log('OPTIONS', options);
  }

  const json = await prepareData(domain, options);

  if (options?.debug) {
    console.log('RESULT', json);
  }

  if (json.length) {
    writeSitemap(json, options);
  } else {
    console.error(cliColors.red, errorMsgWrite(options.outDir ?? OUT_DIR));
  }
};
