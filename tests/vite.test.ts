import { describe, expect, test, vi } from 'vitest';
import * as indexModule from '../src/index';
import { svelteSitemap } from '../src/vite';

describe('Vite plugin', () => {
  test('returns a valid Vite plugin object', () => {
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    expect(plugin.name).toBe('svelte-sitemap');
    expect(plugin.apply).toBe('build');
    expect(typeof plugin.closeBundle).toBe('function');
  });

  test('plugin is unique per options', () => {
    const a = svelteSitemap({ domain: 'https://a.com' });
    const b = svelteSitemap({ domain: 'https://b.com' });

    expect(a).not.toBe(b);
    expect(a.name).toBe(b.name);
  });

  test('runs closeBundle on non-SvelteKit build', async () => {
    const createSitemapSpy = vi
      .spyOn(indexModule, 'createSitemap')
      .mockImplementation(async () => {});
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    if (typeof plugin.configResolved === 'function') {
      plugin.configResolved({
        plugins: [],
        build: { ssr: false }
      } as any);
    }

    if (typeof plugin.closeBundle === 'function') {
      // @ts-ignore
      await plugin.closeBundle();
    }

    expect(createSitemapSpy).toHaveBeenCalled();
    createSitemapSpy.mockRestore();
  });

  test('skips closeBundle on SvelteKit client build', async () => {
    const createSitemapSpy = vi
      .spyOn(indexModule, 'createSitemap')
      .mockImplementation(async () => {});
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    if (typeof plugin.configResolved === 'function') {
      plugin.configResolved({
        plugins: [{ name: 'vite-plugin-sveltekit' }],
        build: { ssr: false }
      } as any);
    }

    if (typeof plugin.closeBundle === 'function') {
      // @ts-ignore
      await plugin.closeBundle();
    }

    expect(createSitemapSpy).not.toHaveBeenCalled();
    createSitemapSpy.mockRestore();
  });

  test('runs closeBundle on SvelteKit server build', async () => {
    const createSitemapSpy = vi
      .spyOn(indexModule, 'createSitemap')
      .mockImplementation(async () => {});
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    if (typeof plugin.configResolved === 'function') {
      plugin.configResolved({
        plugins: [{ name: 'vite-plugin-sveltekit' }],
        build: { ssr: true }
      } as any);
    }

    if (typeof plugin.closeBundle === 'function') {
      // @ts-ignore
      await plugin.closeBundle();
    }

    expect(createSitemapSpy).toHaveBeenCalled();
    createSitemapSpy.mockRestore();
  });
});
