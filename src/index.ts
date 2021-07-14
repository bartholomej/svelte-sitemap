import { prepareData, writeSitemap } from './helpers/global.helper';
import { Options } from './interfaces/global.interface';
import { APP_NAME, DOMAIN, OUT_DIR } from './vars';

export const createSitemap = async (domain: string = DOMAIN, options?: Options) => {
  if (options?.debug) {
    console.log('OPTIONS', options);
  }

  const json = await prepareData(domain, options);

  if (options?.debug) {
    console.log('RESULT', json);
  }

  if (json.length) {
    writeSitemap(json, options.outDir);
  } else {
    console.error(
      `ERROR ${APP_NAME}: Make sure you are using this script as 'postbuild' so '${
        options.outDir ?? OUT_DIR
      }' folder was sucefully created before this script`
    );
  }
};
