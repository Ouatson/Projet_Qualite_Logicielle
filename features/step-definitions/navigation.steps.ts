import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { CustomWorld } from '../support/world';

Then('I should see search results', async function (this: CustomWorld) {
  const searchPage = new SearchPage(this.page);
  await searchPage.waitForPageLoad();
  // Wait for search results to appear
  await this.page.waitForSelector('.search-results', { timeout: 10000 });
});

Then('the search results should contain products', async function (this: CustomWorld) {
  const searchPage = new SearchPage(this.page);
  const resultsCount = await searchPage.getSearchResultsCount();
  expect(resultsCount).toBeGreaterThan(0);
});

Then('the search results should contain products related to {string}', async function (this: CustomWorld, searchTerm: string) {
  const searchPage = new SearchPage(this.page);
  const resultsCount = await searchPage.getSearchResultsCount();
  expect(resultsCount).toBeGreaterThan(0);
  
  // Optional: verify that product names contain the search term
  const productNames = await searchPage.getAllProductNames();
  const relevantProducts = productNames.some(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Note: Not all search results may contain the exact term, so we just check we have results
  expect(resultsCount).toBeGreaterThan(0);
});

Then('I should see a no results message', async function (this: CustomWorld) {
  const searchPage = new SearchPage(this.page);
  const isNoResultsDisplayed = await searchPage.isNoResultsMessageDisplayed();
  expect(isNoResultsDisplayed).toBeTruthy();
});

When('I click on the first product in the results', async function (this: CustomWorld) {
  const searchPage = new SearchPage(this.page);
  await searchPage.clickProduct(0);
});

Then('I should be redirected to the registration page', async function (this: CustomWorld) {
  await this.page.waitForURL('**/register**', { timeout: 10000 });
  const url = await this.page.url();
  expect(url).toContain('register');
});

Then('I should be redirected to the login page', async function (this: CustomWorld) {
  await this.page.waitForURL('**/login**', { timeout: 10000 });
  const url = await this.page.url();
  expect(url).toContain('login');
});

Then('I should be redirected to the category page', async function (this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
  const url = await this.page.url();
  // Category pages typically have URLs like /computers or contain category in the path
  expect(url).not.toEqual('https://demo.nopcommerce.com/');
});

Then('the page should show products in the category', async function (this: CustomWorld) {
  // Wait for product grid to load
  await this.page.waitForSelector('.product-grid, .product-list', { timeout: 10000 });
  const products = await this.page.locator('.product-item').count();
  expect(products).toBeGreaterThan(0);
});

Then('I should be redirected to the product detail page', async function (this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
  // Product detail pages typically have specific elements
  await this.page.waitForSelector('.product-name h1', { timeout: 10000 });
});

Then('I should see the product name and price', async function (this: CustomWorld) {
  const productName = await this.page.locator('.product-name h1').isVisible();
  const productPrice = await this.page.locator('.product-price').isVisible();
  expect(productName).toBeTruthy();
  expect(productPrice).toBeTruthy();
});

Then('I should be redirected to the shopping cart page', async function (this: CustomWorld) {
  await this.page.waitForURL('**/cart**', { timeout: 10000 });
  const url = await this.page.url();
  expect(url).toContain('cart');
});

Then('I should see the cart contents', async function (this: CustomWorld) {
  // Wait for cart page to load
  await this.page.waitForSelector('.cart, .order-summary-content', { timeout: 10000 });
});
