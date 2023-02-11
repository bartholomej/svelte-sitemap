import { existsSync, mkdirSync, readFileSync, rmdirSync } from 'fs';
import { prepareData, writeSitemap } from '../src/helpers/global.helper';
import { PagesJson } from '../src/interfaces/global.interface';
import { CHUNK } from '../src/vars';

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
      ...options,
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
    const json = await prepareData('https://example.com', { ...options, resetTime: true });

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
    ...options,
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
    ...options,
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
    ...options,
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
      ...options,
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
      ...options,
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
      ...options,
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

describe('Creating files', () => {
  const json = [
    {
      page: 'https://example.com/flat/'
    },
    {
      page: 'https://example.com/'
    },
    {
      page: 'https://example.com/page1/'
    },
    {
      page: 'https://example.com/page1/flat1/'
    },
    {
      page: 'https://example.com/page2/'
    },
    {
      page: 'https://example.com/page1/subpage1/'
    },
    {
      page: 'https://example.com/page2/subpage2/'
    },
    {
      page: 'https://example.com/page2/subpage2/subsubpage2/'
    }
  ];

  if (existsSync('build-test')) {
    rmdirSync('build-test', { recursive: true });
  }

  test('Sitemap.xml was created and contains right data', async () => {
    mkdirSync('build-test');
    writeSitemap(json, { outDir: 'build-test' }, 'example.com');

    expect(existsSync('build-test/sitemap.xml')).toBe(true);
    const fileContent = readFileSync('build-test/sitemap.xml', { encoding: 'utf-8' });
    expect(fileContent).toContain('https://example.com/flat/');
    expect((fileContent.match(/<url>/g) || []).length).toEqual(8);

    rmdirSync('build-test', { recursive: true });
  });

  test('Sitemap.xml and sub sitemaps for large pages was created and contains right data', async () => {
    CHUNK.maxSize = 5;

    mkdirSync('build-test');
    writeSitemap(json, { outDir: 'build-test' }, 'https://example.com');

    expect(existsSync('build-test/sitemap.xml')).toBe(true);
    const fileContent = readFileSync('build-test/sitemap.xml', { encoding: 'utf-8' });

    expect(fileContent).toContain('https://example.com/sitemap-1.xml');
    expect((fileContent.match(/<sitemap>/g) || []).length).toEqual(2);

    expect(existsSync('build-test/sitemap-1.xml')).toBe(true);
    expect(existsSync('build-test/sitemap-2.xml')).toBe(true);

    const fileContent2 = readFileSync('build-test/sitemap-2.xml', { encoding: 'utf-8' });
    expect(fileContent2).toContain('https://example.com/page2/subpage2/subsubpage2/');
    expect((fileContent2.match(/<url>/g) || []).length).toEqual(3);

    rmdirSync('build-test', { recursive: true });
  });
});
