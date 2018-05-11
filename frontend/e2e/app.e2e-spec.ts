
import {EntityPage} from "./helpers/entity.page";

describe('App', () => {
  let page: EntityPage;

  beforeEach(() => {
    page = new EntityPage();
  });

  it('should display welcome message', async () => {
    await page.navigateTo();
    await expect(page.getParagraphText()).toContain('App');
  });
});
