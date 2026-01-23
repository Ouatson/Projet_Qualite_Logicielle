import { Page, Locator } from '@playwright/test';

export class WishlistPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly wishlistTable: Locator;
  readonly emptyWishlistMessage: Locator;
  readonly addToCartButtons: Locator;
  readonly removeCheckboxes: Locator;
  readonly updateWishlistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1');
    this.wishlistTable = page.locator('.wishlist-content');
    this.emptyWishlistMessage = page.locator('.no-data');
    this.addToCartButtons = page.locator('button.add-to-cart-button');
    this.removeCheckboxes = page.locator('input[name^="removefromwishlist"]');
    this.updateWishlistButton = page.locator('button[name="updatecart"]');
  }

  async goto() {
    await this.page.goto('https://demo.nopcommerce.com/wishlist', {
      waitUntil: 'domcontentloaded',
    });
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyWishlistMessage.isVisible().catch(() => false);
  }

  async hasItems(): Promise<boolean> {
    return await this.wishlistTable.isVisible().catch(() => false);
  }
}
