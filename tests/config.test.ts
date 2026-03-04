import * as fs from 'fs';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { loadConfig } from '../src/helpers/config.js';

describe('Config File Loading', () => {
  const dir = path.join(process.cwd(), '.tmp-config-test');

  beforeEach(() => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  });

  afterEach(() => {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  });

  test('returns the first successfully loaded setup and ignores the rest (precedence rules)', async () => {
    const validConfigPath = path.join(dir, 'valid-config.ts');
    const anotherConfigPath = path.join(dir, 'another-config.ts');

    fs.writeFileSync(validConfigPath, `export default { domain: 'https://valid.com' };`);
    fs.writeFileSync(anotherConfigPath, `export default { domain: 'https://invalid.com' };`);

    const result = await loadConfig([
      path.join(dir, 'missing.ts'),
      validConfigPath,
      anotherConfigPath
    ]);
    expect(result).toEqual({ domain: 'https://valid.com' });
  });

  test('returns undefined when no config is found', async () => {
    const result = await loadConfig([path.join(dir, 'missing1.ts'), path.join(dir, 'missing2.ts')]);
    expect(result).toBeUndefined();
  });
});
