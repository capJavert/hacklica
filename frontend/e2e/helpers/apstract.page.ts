/**
 * Created by javert on 12.6.2017..
 */
import { browser, element, by } from 'protractor';
declare const require: any; // quick and dirty just the way i like it

export abstract class Page {
  public navigateTo(path: string = "/") {
    return browser.get(path);
  }

  public getCurrentPageTitle() {
    return element(by.css('.breadcrumb > li:last-child > a')).getText();
  }

  public getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  /**
   *
   * @param {number} index - starts at 1 to n
   * @returns {any}
   */
  public navigateBreadcrumb(index: number) {
    return element(by.css('.breadcrumb > li:nth-last-child(' + index + ') > a')).click();
  }
}
