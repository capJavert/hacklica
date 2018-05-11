import {Page} from "./apstract.page";
import {browser, by, element, ExpectedConditions} from "protractor";

export class EntityPage extends Page {
  static async deleteIfPresent(selector, name) {
    await element(by.cssContainingText(selector, name)).isPresent().then( async (isPresent) => {
      if (isPresent) {
        await element(by.css('.mat-row:last-child .mat-column-delete')).click();
        await browser.waitForAngular();

        await element(by.css('.confirm-item-delete')).click();
        await browser.waitForAngular();

        await browser.wait(ExpectedConditions.visibilityOf(element(by.css('snack-bar-container'))), 5000);

        await expect(element(by.cssContainingText(selector, name)).isPresent()).toBe(false);
      } else {
        await expect(true).toBe(false);
      }
    });
  }
}
