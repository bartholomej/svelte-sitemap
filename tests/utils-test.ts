import { existsSync, rmdirSync } from 'fs';
import { PagesJson } from '../src/interfaces/global.interface';

const options: { outDir?: string } = {};

export const processEnv = process.env;

if (process.env.OUT_DIR) options.outDir = process.env.OUT_DIR;

export const optionsTest = options;

console.log('JEST OPTIONS:', optionsTest);

export const sortbyPage = (json: PagesJson[]) => json.sort((a, b) => a.page.localeCompare(b.page));

export const deleteFolderIfExist = () => {
  if (existsSync('build-test')) {
    rmdirSync('build-test', { recursive: true });
  }
};

export const TEST_FOLDER = 'build-test';
