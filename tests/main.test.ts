import { describe, expect, test } from 'vitest';
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
