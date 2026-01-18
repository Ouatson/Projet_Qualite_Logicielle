import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { CustomWorld } from '../support/world';

When('I add the product to cart', async function (this: CustomWorld) {
  const productPage = new ProductPage(this.page);
  await productPage.addToCart();
});

When('I set the product quantity to {string}', async function (this: CustomWorld, quantity: string) {
  const productPage = new ProductPage(this.page);
  await productPage.setQuantity(quantity);
});

When('I add the product to wishlist', async function (this: CustomWorld) {
  const productPage = new ProductPage(this.page);
  await productPage.addToWishlist();
});

Then('I should see a success notification', async function (this: CustomWorld) {
  const productPage = new ProductPage(this.page);
  const isNotificationVisible = await productPage.isSuccessNotificationVisible();
  expect(isNotificationVisible).toBeTruthy();
});

Then('the notification should say {string}', async function (this: CustomWorld, expectedMessage: string) {
  const productPage = new ProductPage(this.page);
  const notificationText = await productPage.getSuccessNotificationText();
  expect(notificationText).toContain(expectedMessage);
});
