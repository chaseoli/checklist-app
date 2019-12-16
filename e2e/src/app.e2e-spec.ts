import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let appPage: AppPage;

  beforeEach(() => {
    appPage = new AppPage();
  });

  it('should display ui shell name', async () => {
    appPage.navigateTo();
    console.log(appPage);
    expect( await appPage.getTitleText()).toEqual('Project Private');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
