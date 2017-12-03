import { AppPage } from './app.po';

describe('tally-web App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title text', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Tally');
  });
});
