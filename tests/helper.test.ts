import { describe, expect, test } from 'vitest';
import { removeHtml } from '../src/helpers/global.helper';

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
