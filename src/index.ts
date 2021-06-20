import { buildSitemap, writeSitemap } from './helpers/global.helper';
import { Options } from './interfaces/global.interface';
import { DOMAIN } from './vars';

export const createSitemap = async (domain: string = DOMAIN, options?: Options) => {
  if (options?.debug) {
    console.log('OPTIONS', options);
  }

  const json = await buildSitemap(domain, options);

  if (options?.debug) {
    console.log('RESULT', json);
  }

  writeSitemap(json);
};
