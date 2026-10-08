import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { CHUNK } from '../src/const';
import type { OptionsSvelteSitemap } from '../src/dto';
import { createSitemap } from '../src/index';

describe('Messages', () => {
  const DIR = 'build-test-messages';
  let output: string[];

  const run = async (options: Partial<OptionsSvelteSitemap>) => {
    output = [];
    const collect = (...args: unknown[]) => output.push(args.join(' '));
    vi.spyOn(console, 'log').mockImplementation(collect);
    vi.spyOn(console, 'warn').mockImplementation(collect);
    vi.spyOn(console, 'error').mockImplementation(collect);
    await createSitemap({ domain: 'https://example.com', outDir: DIR, ...options });
    return output.join('\n');
  };

  beforeAll(() => {
    mkdirSync(`${DIR}/about`, { recursive: true });
    writeFileSync(`${DIR}/index.html`, '');
    writeFileSync(`${DIR}/about/index.html`, '');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    CHUNK.maxSize = 50_000;
  });

  afterAll(() => {
    if (existsSync(DIR)) rmSync(DIR, { recursive: true, force: true });
  });

  test.each([DIR, `./${DIR}`, `${DIR}/`])('success message path for outDir %s', async (outDir) => {
    const out = await run({ outDir });

    expect(out).toContain(`Check your new sitemap here: ./${DIR}/sitemap.xml`);
  });

  test('missing folder shows only the folder error', async () => {
    const out = await run({ outDir: 'build-test-messages-missing' });

    expect(out).toContain("Folder 'build-test-messages-missing/' doesn't exist.");
    expect(out).not.toContain('could not be created');
  });

  test('all pages excluded by ignore', async () => {
    const out = await run({ ignore: ['**'] });

    expect(out).toContain("All pages were excluded by the 'ignore' option");
    expect(out).not.toContain('There is no static html file');
    expect(out).not.toContain('could not be created');
  });

  test('all pages excluded by transform', async () => {
    const out = await run({ transform: () => null });

    expect(out).toContain("All pages were excluded by the 'transform' option");
    expect(out).not.toContain('could not be created');
  });

  test('chunk message shows the number of sitemaps and their size', async () => {
    CHUNK.maxSize = 1;
    const out = await run({});

    expect(out).toContain('Writing 2 sitemaps of up to 1 pages and their index sitemap.xml');
  });

  test('invalid changeFreq does not mention the CLI flag', async () => {
    const out = await run({ changeFreq: 'sometimes' as never });

    expect(out).toContain("Change frequency 'sometimes' is not valid, so I ignore it.");
    expect(out).not.toContain('--change-freq');
  });
});
