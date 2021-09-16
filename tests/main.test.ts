import { prepareData } from '../src/helpers/global.helper';
import { PagesJson } from '../src/interfaces/global.interface';

const options: { outDir?: string } = {};

const cliArgs = process.argv.filter((x) => x.startsWith('--outDir='))[0];
if (cliArgs?.split('=')[1]) {
  options.outDir = cliArgs?.split('=')[1];
}
console.log('JEST OPTIONS:', options);

const sortbyPage = (json: PagesJson[]) => json.sort((a, b) => a.page.localeCompare(b.page));

// Sitemap
describe('Create JSON model', () => {
  test('Default sitemap', async () => {
    const json = await prepareData('https://example.com', { ...options });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com',
          changeFreq: '',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1',
          changeFreq: '',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2',
          changeFreq: '',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1',
          changeFreq: '',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2',
          changeFreq: '',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2',
          changeFreq: '',
          lastMod: ''
        }
      ])
    );
  });

  test('Sitemap with frequency', async () => {
    const json = await prepareData('https://example.com', {
      ...options,
      changeFreq: 'daily'
    });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
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
    const json = await prepareData('https://example.com', { ...options, resetTime: true });

    const today = new Date().toISOString().split('T')[0];

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com',
          changeFreq: '',
          lastMod: today
        },
        {
          page: 'https://example.com/page1',
          changeFreq: '',
          lastMod: today
        },
        {
          page: 'https://example.com/page2',
          changeFreq: '',
          lastMod: today
        },
        {
          page: 'https://example.com/page1/subpage1',
          changeFreq: '',
          lastMod: today
        },
        {
          page: 'https://example.com/page2/subpage2',
          changeFreq: '',
          lastMod: today
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2',
          changeFreq: '',
          lastMod: today
        }
      ])
    );
  });
});

test('Sitemap ignore **/page2', async () => {
  const json = await prepareData('https://example.com', {
    ...options,
    ignore: '**/page2',
    debug: true
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page1',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/subpage1',
        changeFreq: '',
        lastMod: ''
      }
    ])
  );
});

test('Sitemap ignore Page1', async () => {
  const json = await prepareData('https://example.com', {
    ...options,
    ignore: 'page1',
    debug: true
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2/subsubpage2',
        changeFreq: '',
        lastMod: ''
      }
    ])
  );
});

test('Add trailing slashes', async () => {
  const json = await prepareData('https://example.com/', {
    ...options,
    trailingSlashes: true
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/subpage1/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/subpage2/subsubpage2/',
        changeFreq: '',
        lastMod: ''
      }
    ])
  );
});

test('Add trailing slashes and ignore page2', async () => {
  const json = await prepareData('https://example.com/', {
    ...options,
    trailingSlashes: true,
    ignore: 'page2'
  });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page1/subpage1/',
        changeFreq: '',
        lastMod: ''
      }
    ])
  );
});

test('Add trailing slashes + ignore subpage2 + reset time', async () => {
  const json = await prepareData('https://example.com/', {
    ...options,
    trailingSlashes: true,
    ignore: 'subppage2',
    resetTime: true
  });

  const today = new Date().toISOString().split('T')[0];

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/',
        changeFreq: '',
        lastMod: today
      },
      {
        page: 'https://example.com/page1/',
        changeFreq: '',
        lastMod: today
      },
      {
        page: 'https://example.com/page2/',
        changeFreq: '',
        lastMod: today
      },
      {
        page: 'https://example.com/page1/subpage1/',
        changeFreq: '',
        lastMod: today
      },
      {
        page: 'https://example.com/page2/subpage2/',
        changeFreq: '',
        lastMod: today
      },
      {
        page: 'https://example.com/page2/subpage2/subsubpage2/',
        changeFreq: '',
        lastMod: today
      }
    ])
  );
});
