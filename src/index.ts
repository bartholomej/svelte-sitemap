import { prepareData, writeSitemap } from './helpers/global.helper';
import { Options } from './interfaces/global.interface';
import { APP_NAME, DOMAIN } from './vars';

export const createSitemap = async (domain: string = DOMAIN, options?: Options) => {
  if (options?.debug) {
    console.log('OPTIONS', options);
  }

  const json = await prepareData(domain, options);

  if (options?.debug) {
    console.log('RESULT', json);
  }

  if (json.length) {
    writeSitemap(json);
  } else {
    console.error(
      `ERROR ${APP_NAME}: Make sure you are using this script as 'postbuild' so 'build' folder was sucefully created before this script`
    );
  }
};
