import { getFiles } from '../src/helpers/global.helper';

// User Ratings
describe('Create default sitemap', () => {
  test('Default sitemap', () => {
    const files = getFiles({ debug: false });

    expect(files).toMatchObject([
      {
        lastModified: '2021-06-09',
        title: 'homepage',
        created: '2021-06-09',
        slug: 'homepage'
      },
      {
        lastModified: '2021-06-09',
        title: 'page1',
        created: '2021-06-09',
        slug: 'page1'
      },
      {
        lastModified: '2021-06-09',
        title: 'page1/subpage1',
        created: '2021-06-09',
        slug: 'page1/subpage1'
      },
      {
        lastModified: '2021-06-09',
        title: 'page2',
        created: '2021-06-09',
        slug: 'page2'
      },
      {
        lastModified: '2021-06-09',
        title: 'page2/subpage2',
        created: '2021-06-09',
        slug: 'page2/subpage2'
      },
      {
        lastModified: '2021-06-09',
        title: 'page2/subpage2/subsubpage2',
        created: '2021-06-09',
        slug: 'page2/subpage2/subsubpage2'
      }
    ]);
  });
});
