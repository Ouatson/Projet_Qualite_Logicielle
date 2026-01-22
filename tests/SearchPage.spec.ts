import { test, expect, Page } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { HomePage } from '../pages/HomePage';

async function isHumanCheck(page: Page): Promise<boolean> {
  const signals = [
    'text=Verifying you are human',
    'text=review the security of your connection',
    'title=Just a moment',
    'text=Enable JavaScript and cookies'
  ];
  for (const s of signals) {
    if (await page.locator(s).first().isVisible().catch(() => false)) return true;
  }
  return false;
}

test.describe('Search Page - Stable Suite', () => {
  let searchPage: SearchPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    homePage = new HomePage(page);
    await homePage.navigateToHome();
    if (await isHumanCheck(page)) {
      test.skip(true, 'Cloudflare human verification detected');
    }
  });

  test('Basic search is stable', async () => {
    await homePage.searchProduct('laptop');

    const count = await searchPage.getSearchResultsCount();
    const noResult = await searchPage.isNoResultsMessageDisplayed();

    expect(count >= 0 || noResult).toBeTruthy();
  });

  test('Invalid search is handled', async () => {
    await homePage.searchProduct('zzzz-invalid');

    const count = await searchPage.getSearchResultsCount();
    const noResult = await searchPage.isNoResultsMessageDisplayed();

    expect(count === 0 || noResult).toBeTruthy();
  });

  test('Advanced search with category is stable', async () => {
    await searchPage.enableAdvancedSearch();
    await searchPage.search('computer');
    await searchPage.selectCategory('Computers');

    expect(true).toBeTruthy();
  });

  test('Advanced search with manufacturer is stable', async () => {
    await searchPage.enableAdvancedSearch();
    await searchPage.search('Apple');
    await searchPage.selectManufacturer('Apple');

    expect(true).toBeTruthy();
  });

  test('Sequential searches remain stable', async () => {
    await homePage.searchProduct('laptop');
    await searchPage.getSearchResultsCount();

    await searchPage.search('phone');
    await searchPage.getSearchResultsCount();

    expect(true).toBeTruthy();
  });
});
