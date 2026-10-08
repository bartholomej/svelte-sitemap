import { afterEach, describe, expect, test, vi } from 'vitest';
import type { OptionsSvelteSitemap } from '../src/dto';
import { validateOptions } from '../src/helpers/config';
import { createSitemap } from '../src/index';

describe('Options validation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each([undefined, {}, { domain: '' }, { domain: 42 }])(
    'missing domain %o throws a readable error',
    async (options) => {
      vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(createSitemap(options as OptionsSvelteSitemap)).rejects.toThrow(
        "svelte-sitemap: 'domain' option is required"
      );
    }
  );

  test.each(['example.com', 'www.example.com/', 'https://'])(
    'domain %s that is not a full URL warns',
    (domain) => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      validateOptions({ domain });

      expect(logSpy.mock.calls.flat().join(' ')).toContain(
        `Option 'domain' should be a full URL, e.g. 'https://example.com'. Got '${domain}'.`
      );
    }
  );

  test.each(['https://example.com', 'https://example.com/', 'http://localhost:5173'])(
    'domain %s does not warn',
    (domain) => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      validateOptions({ domain });

      expect(logSpy).not.toHaveBeenCalled();
    }
  );

  test('unknown options warn', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    validateOptions({ domain: 'https://example.com', outdir: 'dist', nope: 1 } as never);

    expect(logSpy.mock.calls.flat().join(' ')).toContain(
      'Unknown options, so I ignore them: outdir, nope'
    );
  });

  test('additional as a string becomes an array', () => {
    const options = validateOptions({
      domain: 'https://example.com',
      additional: 'about' as never
    });

    expect(options.additional).toEqual(['about']);
  });
});
