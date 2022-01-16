import { existsSync } from 'fs';
import { resolve } from 'path';
import { cliColors } from './vars.helper';

export const loadFile = <T>(fileName: string, throwError = true): T => {
  const filePath = resolve(resolve(process.cwd(), fileName));

  if (existsSync(filePath)) {
    console.log(cliColors.cyanAndBold, `> Loading config from ${fileName}`);
    return require(filePath);
  }

  if (throwError) {
    new Error(`${filePath} does not exist.`);
  }
  return null;
};
