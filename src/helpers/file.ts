import { existsSync } from 'fs';
import { resolve } from 'path';

export const loadFile = <T>(fileName: string, throwError = true): T => {
  const filePath = resolve(resolve(process.cwd(), fileName));

  if (existsSync(filePath)) {
    return require(filePath);
  }

  if (throwError) {
    new Error(`${filePath} does not exist.`);
  }
  return null;
};
