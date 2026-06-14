import { describe, expect, test, vi } from 'vitest';
import { removeHtml, checkPrerenderRoutes } from '../src/helpers/global.helper';
import fs from 'fs';

describe('Remove html', () => {
  test('With html', () => {
    const fileName = 'flat.html';

    expect(removeHtml(fileName)).toBe('flat');
  });
  test('Without html', () => {
    const fileName = 'flat/';

    expect(removeHtml(fileName)).toBe('flat/');
  });
  test('With some html', () => {
    const fileName = 'fla.htmldocument.html';

    expect(removeHtml(fileName)).toBe('fla.htmldocument');
  });
  test('Only slash', () => {
    const fileName = '/';

    expect(removeHtml(fileName)).toBe('/');
  });
  test('Bad option', () => {
    const fileName: string = undefined;

    expect(removeHtml(fileName)).toBe(undefined);
  });
});

describe('checkPrerenderRoutes', () => {
  test('should warn if only root index.html is found and no additional routes', async () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await checkPrerenderRoutes(['build/index.html'], 'build');

    expect(warnSpy).toHaveBeenCalled();

    existsSyncSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('should not warn if about/index.html is also found', async () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await checkPrerenderRoutes(['build/index.html', 'build/about/index.html'], 'build');

    expect(warnSpy).not.toHaveBeenCalled();

    existsSyncSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('should not warn if pages list is empty', async () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await checkPrerenderRoutes([], 'build');

    expect(warnSpy).not.toHaveBeenCalled();

    existsSyncSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
