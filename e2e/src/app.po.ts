import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    // return browser.get(browser.baseUrl) as Promise<any>;
    return browser.get(browser.baseUrl + '/private') as Promise<any>;
  }

  async getTitleText() {

    const str = await element.all(by.css('app-root ibm-header header a')).get(1).getText()
    return  str.replace(/(\r\n|\n|\r)/gm, "");
  }
}
