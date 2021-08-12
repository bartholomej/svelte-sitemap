import { prepareData } from '../src/helpers/global.helper';
import { PagesJson } from '../src/interfaces/global.interface';

const sortbyPage = (json: PagesJson[]) => json.sort((a, b) => a.page.localeCompare(b.page));

// Sitemap
describe('Create JSON model', () => {
  test('Default sitemap', async () => {
    const json = await prepareData('https://example.com');

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

  test('Sitemap with frequency', async () => {
    const json = await prepareData('https://example.com', { changeFreq: 'daily' });

    expect(sortbyPage(json)).toMatchObject(
      sortbyPage([
        {
          page: 'https://example.com/',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page1/subpage1/',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/',
          changeFreq: 'daily',
          lastMod: ''
        },
        {
          page: 'https://example.com/page2/subpage2/subsubpage2/',
          changeFreq: 'daily',
          lastMod: ''
        }
      ])
    );
  });

  test('Sitemap with frequency', async () => {
    const json = await prepareData('https://example.com', { resetTime: true });

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
});

test('Sitemap ignore **/page2', async () => {
  const json = await prepareData('https://example.com', { ignore: '**/page2', debug: true });

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

test('Sitemap ignore Page1', async () => {
  const json = await prepareData('https://example.com', { ignore: 'page1', debug: true });

  expect(sortbyPage(json)).toMatchObject(
    sortbyPage([
      {
        page: 'https://example.com/',
        changeFreq: '',
        lastMod: ''
      },
      {
        page: 'https://example.com/page2/',
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
