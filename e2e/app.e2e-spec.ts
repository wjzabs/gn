import { GnPage } from './app.po';

describe('gn App', () => {
  let page: GnPage;

  beforeEach(() => {
    page = new GnPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
