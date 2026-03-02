import { existsSync } from 'fs';
import { createJiti } from 'jiti';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const jiti = createJiti(filename);

export const loadFile = async <T>(fileName: string, throwError = true): Promise<T | null> => {
  const filePath = resolve(resolve(process.cwd(), fileName));

  if (existsSync(filePath)) {
    try {
      const module = await jiti.import(filePath, { default: true });
      return module as T;
    } catch (err: any) {
      throw err;
    }
  }

  if (throwError) {
    throw new Error(`${filePath} does not exist.`);
  }
  return null;
};
