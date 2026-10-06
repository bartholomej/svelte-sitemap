import type { Plugin, ResolvedConfig, ViteBuilder } from 'vite';
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
      } as unknown as ResolvedConfig);
    }

    if (typeof plugin.closeBundle === 'function') {
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
      } as unknown as ResolvedConfig);
    }

    if (typeof plugin.closeBundle === 'function') {
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
      } as unknown as ResolvedConfig);
    }

    if (typeof plugin.closeBundle === 'function') {
      await plugin.closeBundle();
    }

    expect(createSitemapSpy).toHaveBeenCalled();
    createSitemapSpy.mockRestore();
  });

  test('runs buildApp on SvelteKit 3 build after environments are built', async () => {
    const createSitemapSpy = vi
      .spyOn(indexModule, 'createSitemap')
      .mockImplementation(async () => {});
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    configResolved(plugin, { plugins: [{ name: 'vite-plugin-sveltekit-adapter' }], build: {} });
    await closeBundle(plugin);
    expect(createSitemapSpy).not.toHaveBeenCalled();

    await buildApp(plugin, { ssr: { isBuilt: true }, client: { isBuilt: true } });
    expect(createSitemapSpy).toHaveBeenCalledTimes(1);
    createSitemapSpy.mockRestore();
  });

  test('skips buildApp before environments are built', async () => {
    const createSitemapSpy = vi
      .spyOn(indexModule, 'createSitemap')
      .mockImplementation(async () => {});
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    configResolved(plugin, { plugins: [{ name: 'vite-plugin-sveltekit' }], build: {} });
    await buildApp(plugin, { client: { isBuilt: false } });

    expect(createSitemapSpy).not.toHaveBeenCalled();
    createSitemapSpy.mockRestore();
  });

  test('does not generate twice when closeBundle already ran (SvelteKit 2)', async () => {
    const createSitemapSpy = vi
      .spyOn(indexModule, 'createSitemap')
      .mockImplementation(async () => {});
    const plugin = svelteSitemap({ domain: 'https://example.com' });

    configResolved(plugin, { plugins: [{ name: 'vite-plugin-sveltekit' }], build: { ssr: true } });
    await closeBundle(plugin);
    await buildApp(plugin, { ssr: { isBuilt: true } });

    expect(createSitemapSpy).toHaveBeenCalledTimes(1);
    createSitemapSpy.mockRestore();
  });
});

function configResolved(plugin: Plugin, config: object) {
  const hook = plugin.configResolved as (config: ResolvedConfig) => void;
  hook(config as unknown as ResolvedConfig);
}

async function closeBundle(plugin: Plugin) {
  const hook = plugin.closeBundle as () => Promise<void>;
  await hook();
}

async function buildApp(plugin: Plugin, environments: Record<string, { isBuilt: boolean }>) {
  const hook = plugin.buildApp as { handler: (builder: ViteBuilder) => Promise<void> };
  await hook.handler({ environments } as unknown as ViteBuilder);
}
