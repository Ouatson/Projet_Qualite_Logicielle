import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CustomWorld } from '../support/world';

Given('I am on the home page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.navigateToHome();
  await homePage.waitForPageLoad();
});

Then('I should see the nopCommerce logo', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  const isLogoVisible = await homePage.isLogoVisible();
  expect(isLogoVisible).toBeTruthy();
});

Then('the page title should contain {string}', async function (this: CustomWorld, expectedTitle: string) {
  const homePage = new HomePage(this.page);
  const title = await homePage.getTitle();
  expect(title).toContain(expectedTitle);
});

When('I click on the Register link', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.clickRegister();
});

When('I click on the Login link', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.clickLogin();
});

When('I search for {string}', async function (this: CustomWorld, searchTerm: string) {
  const homePage = new HomePage(this.page);
  await homePage.searchProduct(searchTerm);
});

When('I click on the {string} category', async function (this: CustomWorld, categoryName: string) {
  const homePage = new HomePage(this.page);
  await homePage.clickCategory(categoryName);
});

When('I click on the Shopping Cart link', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.clickShoppingCart();
});
