import { existsSync, rmdirSync } from 'fs';
import { PagesJson } from '../src/interfaces/global.interface';

const options: { outDir?: string } = {};

export const cliArgs = process.argv.filter((x) => x.startsWith('--outDir='))[0];
if (cliArgs?.split('=')[1]) {
  options.outDir = cliArgs?.split('=')[1];
}

export const optionsTest = options;

console.log('JEST OPTIONS:', optionsTest);

export const sortbyPage = (json: PagesJson[]) => json.sort((a, b) => a.page.localeCompare(b.page));

export const deleteFolderIfExist = () => {
  if (existsSync('build-test')) {
    rmdirSync('build-test', { recursive: true });
  }
};

export const TEST_FOLDER = 'build-test';
