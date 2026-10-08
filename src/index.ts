import { APP_NAME, INTEGRATION_METHODS, OUT_DIR } from './const.js';
import type { IntegrationMethod, OptionsSvelteSitemap } from './dto/index.js';
import { validateOptions } from './helpers/config.js';
import { prepareData, writeSitemap } from './helpers/global.helper.js';
import {
  cliColors,
  errorMsgWrite,
  getDeprecationWarning,
  methodMsg
} from './helpers/vars.helper.js';

let introPrinted = false;

export const printIntro = (method?: IntegrationMethod): void => {
  if (!introPrinted) {
    console.log(cliColors.cyanAndBold, `> Using ${APP_NAME}`);
    if (method) {
      console.log(methodMsg(method));
      const warning = getDeprecationWarning(method);
      if (warning) {
        console.log(cliColors.yellow, warning);
      }
    }
    introPrinted = true;
  }
};

export const createSitemap = async (
  options: OptionsSvelteSitemap,
  method: IntegrationMethod = INTEGRATION_METHODS.API
): Promise<void> => {
  printIntro(method);

  const config = validateOptions(options);

  if (config.debug) {
    console.log('OPTIONS', config);
  }

  const json = await prepareData(config.domain, config);

  if (config.debug) {
    console.log('RESULT', json);
  }

  if (json.length) {
    writeSitemap(json, config, config.domain);
  } else {
    console.error(cliColors.red, errorMsgWrite(config.outDir ?? OUT_DIR, 'sitemap.xml'));
  }
};

export { svelteSitemap } from './vite.js';
export type * from './dto/index.js';
