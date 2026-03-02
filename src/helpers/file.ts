import { existsSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const dynamicImport = new Function('specifier', 'return import(specifier)');

export const loadFile = async <T>(fileName: string, throwError = true): Promise<T | null> => {
  const filePath = resolve(resolve(process.cwd(), fileName));

  if (existsSync(filePath)) {
    try {
      return require(filePath);
    } catch (err: any) {
      if (err.code === 'ERR_REQUIRE_ESM') {
        const module = await dynamicImport(pathToFileURL(filePath).href);
        return module.default || module;
      }
      throw err;
    }
  }

  if (throwError) {
    throw new Error(`${filePath} does not exist.`);
  }
  return null;
};
