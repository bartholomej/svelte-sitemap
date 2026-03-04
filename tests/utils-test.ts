import { existsSync, rmSync } from 'fs';
import { PagesJson } from './../src/dto';

const options: { outDir?: string } = {};

export const processEnv = process.env;

if (process.env.OUT_DIR) options.outDir = process.env.OUT_DIR;

export const optionsTest = options;

console.log('TEST OPTIONS:', optionsTest);

export const sortbyPage = (json: PagesJson[]) =>
  json.sort((a, b) => (a.page || a.loc || '').localeCompare(b.page || b.loc || ''));

export const deleteFolderIfExist = () => {
  if (existsSync('build-test')) {
    rmSync('build-test', { recursive: true, force: true });
  }
};

export const TEST_FOLDER = 'build-test';
