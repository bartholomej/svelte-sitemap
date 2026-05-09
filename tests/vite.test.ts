import { describe, expect, test } from 'vitest';
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
});
