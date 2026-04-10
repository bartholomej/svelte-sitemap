import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { prepareData } from '../src/helpers/global.helper';
import { optionsTest, sortbyPage } from './utils-test';

// Sitemap
describe('Create JSON model', () => {
  test('Default sitemap', async () => {
    const json = await prepareData('https://example.com', { ...optionsTest });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/flat1',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page2',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2',
          changeFreq: null,
          lastMod: ''
        }
      ])
    );
  });

  test('Sitemap with frequency', async () => {
    const json = await prepareData('https://example.com', {
      ...optionsTest,
      changeFreq: 'daily'
    });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/flat1',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2',
          changeFreq: 'daily',
          lastMod: ''
        }
      ])
    );
  });

  test('Sitemap with additional pages', async () => {
    const json = await prepareData('https://example.com', {
      ...optionsTest,
      additional: ['my-page', 'my-page2']
    });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat',
          lastMod: ''
        },
        {
          page: 'https://example.com',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/flat1',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2',
          lastMod: ''
        },
        {
          lastMod: '',
          page: 'https://example.com/my-page'
        },
        {
          lastMod: '',
          page: 'https://example.com/my-page2'
        }
      ])
    );
  });

  test('Sitemap with reset time', async () => {
    const json = await prepareData('https://example.com', { ...optionsTest, resetTime: true });

    const today = new Date().toISOString().split('T')[0];

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page1',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page1/flat1',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page2',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page1/subpage1',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page2/subpage2',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2',
          changeFreq: null,
          lastMod: today
        }
      ])
    );
  });
});

test('Sitemap ignore **/page2', async () => {
  const json = await prepareData('https://example.com', {
    ...optionsTest,
    ignore: '**/page2',
    debug: true
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/flat',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page1',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/flat1',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/subpage1',
        changeFreq: null,
        lastMod: ''
      }
    ])
  );
});

test('Sitemap bad cahngeFreq', async () => {
  const json = await prepareData('https://example.com', {
    ...optionsTest,
    changeFreq: 'veryverybadchoice' as unknown as any,
    debug: true
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/flat',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page1',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/flat1',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page2',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/subpage1',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2/subsubpage2',
        changeFreq: null,
        lastMod: ''
      }
    ])
  );
});

test('Sitemap ignore Page1', async () => {
  const json = await prepareData('https://example.com', {
    ...optionsTest,
    ignore: 'page1',
    debug: true
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/flat',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page2',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2',
        changeFreq: null,
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2/subsubpage2',
        changeFreq: null,
        lastMod: ''
      }
    ])
  );
});
describe('Trailing slashes', () => {
  test('Add trailing slashes', async () => {
    const json = await prepareData('https://example.com/', {
      ...optionsTest,
      trailingSlashes: true
    });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/flat1/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2/',
          changeFreq: null,
          lastMod: ''
        }
      ])
    );
  });

  test('Add trailing slashes and ignore page2', async () => {
    const json = await prepareData('https://example.com/', {
      ...optionsTest,
      trailingSlashes: true,
      ignore: 'page2'
    });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/flat1/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/',
          changeFreq: null,
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1/',
          changeFreq: null,
          lastMod: ''
        }
      ])
    );
  });

  test('Add trailing slashes + ignore subpage2 + reset time', async () => {
    const json = await prepareData('https://example.com/', {
      ...optionsTest,
      trailingSlashes: true,
      ignore: 'subppage2',
      resetTime: true
    });

    const today = new Date().toISOString().split('T')[0];

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/flat/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page1/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page1/flat1/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page2/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page1/subpage1/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page2/subpage2/',
          changeFreq: null,
          lastMod: today
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2/',
          changeFreq: null,
          lastMod: today
        }
      ])
    );
  });
});

describe('URI encoding', () => {
  const SPACE_DIR = 'build-test-spaces';
  const specialDirs = ['with+plus&and', '100% done', 'eq=sign', 'comma,name', 'already%20encoded'];

  beforeAll(() => {
    if (!existsSync(SPACE_DIR)) mkdirSync(SPACE_DIR);
    mkdirSync(`${SPACE_DIR}/with space`, { recursive: true });
    writeFileSync(`${SPACE_DIR}/with space/index.html`, '');
    for (const dir of specialDirs) {
      mkdirSync(`${SPACE_DIR}/${dir}`, { recursive: true });
      writeFileSync(`${SPACE_DIR}/${dir}/index.html`, '');
    }
    writeFileSync(`${SPACE_DIR}/index.html`, '');
  });

  afterAll(() => {
    if (existsSync(SPACE_DIR)) rmSync(SPACE_DIR, { recursive: true, force: true });
  });

  test('Spaces in paths are encoded as %20', async () => {
    const json = await prepareData('https://example.com', { outDir: SPACE_DIR });
    const pages = json.map((item) => item.page);

    expect(pages).toContain('https://example.com');
    expect(pages).toContain('https://example.com/with%20space');
  });

  test('Spaces in paths with trailing slashes are encoded as %20', async () => {
    const json = await prepareData('https://example.com/', {
      outDir: SPACE_DIR,
      trailingSlashes: true
    });
    const pages = json.map((item) => item.page);

    expect(pages).toContain('https://example.com/');
    expect(pages).toContain('https://example.com/with%20space/');
  });

  test('Special characters in paths are percent-encoded', async () => {
    const json = await prepareData('https://example.com', { outDir: SPACE_DIR });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        { page: 'https://example.com', changeFreq: null, lastMod: '' },
        { page: 'https://example.com/with%20space', changeFreq: null, lastMod: '' },
        { page: 'https://example.com/with%2Bplus%26and', changeFreq: null, lastMod: '' },
        { page: 'https://example.com/100%25%20done', changeFreq: null, lastMod: '' },
        { page: 'https://example.com/eq%3Dsign', changeFreq: null, lastMod: '' },
        { page: 'https://example.com/comma%2Cname', changeFreq: null, lastMod: '' },
        { page: 'https://example.com/already%20encoded', changeFreq: null, lastMod: '' }
      ])
    );
  });
});
