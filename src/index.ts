import { Options } from 'interfaces/global.interface';
import { buildSitemap } from './helpers/global.helper';
import { DOMAIN } from './vars';

export const createSitemap = (domain: string = DOMAIN, options: Options) => {
  buildSitemap(domain, options);
};
