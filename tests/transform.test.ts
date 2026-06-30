import { describe, expect, test, vi } from 'vitest';
import { prepareData } from '../src/helpers/global.helper';

// Mock fast-glob to return a few predictable files
vi.mock('fast-glob', () => ({
  default: vi
    .fn()
    .mockResolvedValue(['build/index.html', 'build/about/index.html', 'build/contact/index.html'])
}));

// Mock fs.existsSync to always return true for build folder
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    existsSync: vi.fn().mockImplementation((path) => {
      if (path === 'build') return true;
      return actual.existsSync(path);
    })
  };
});

describe('Transform function cases', () => {
  const domain = 'https://example.com';
  const today = new Date().toISOString().split('T')[0];

  test('should merge transform results with default values (keeping lastmod)', async () => {
    const options = {
      outDir: 'build',
      resetTime: true,
      transform: (config, path) => {
        if (path === '/about') {
          return { changefreq: 'weekly' as const };
        }
      }
    };

    const result = await prepareData(domain, options);

    // Find 'about' page
    const about = result.find((r) => r.loc === 'https://example.com/about');
    expect(about?.changefreq).toBe('weekly');
    expect(about?.lastmod).toBe(today); // Kept from defaults

    // Find 'contact' page (not transformed, should use defaults)
    const contact = result.find((r) => r.loc === 'https://example.com/contact');
    expect(contact?.lastmod).toBe(today);
    expect(contact?.changefreq).toBe(null);
  });

  test('should skip page when transform returns null', async () => {
    const options = {
      outDir: 'build',
      transform: (config, path) => {
        if (path === '/about') return null;
        return { loc: path };
      }
    };

    const result = await prepareData(domain, options);

    expect(result.find((r) => r.loc.includes('about'))).toBeUndefined();
    expect(result.find((r) => r.loc.includes('contact'))).toBeDefined();
  });

  test('should use defaults when transform returns undefined', async () => {
    const options = {
      outDir: 'build',
      resetTime: true,
      transform: (config, path) => {
        if (path === '/about') return { priority: 0.9 };
        // returns undefined for others
      }
    };

    const result = await prepareData(domain, options);

    const contact = result.find((r) => r.loc === 'https://example.com/contact');
    expect(contact).toBeDefined();
    expect(contact?.lastmod).toBe(today); // Default kept
  });

  test('should handle root path trailing slash correctly with loc: path', async () => {
    const options = {
      outDir: 'build',
      trailingSlashes: false,
      transform: (config, path) => {
        return { loc: path };
      }
    };

    const result = await prepareData(domain, options);

    const root = result.find((r) => r.loc === 'https://example.com');
    expect(root).toBeDefined();
    expect(root?.loc).toBe('https://example.com'); // NOT https://example.com/
  });
});
