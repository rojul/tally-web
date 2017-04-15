import { TallyWebPage } from './app.po';

describe('tally-web App', () => {
  let page: TallyWebPage;

  beforeEach(() => {
    page = new TallyWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
