import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Product Page Object
 * Represents a product detail page
 */
export class ProductPage extends BasePage {
  // Locators
  private readonly productDetailsRoot: Locator;
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly addToWishlistButton: Locator;
  private readonly addToCompareButton: Locator;
  private readonly emailAFriendButton: Locator;
  private readonly successNotification: Locator;
  private readonly closeNotificationButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.productDetailsRoot = page.locator('.product-details-page');
    this.productName = page.locator('.product-name h1');
    this.productPrice = page.locator('.product-price span');
    this.productDescription = page.locator('.full-description');
    this.quantityInput = page.locator('.qty-input');
    // this.addToCartButton = page.locator('.product-box-add-to-cart-button');
    // this.addToWishlistButton = page.locator('.add-to-wishlist-button');
    // this.addToCartButton = page.locator('#add-to-cart-button-5');
    // this.addToWishlistButton = page.locator('#add-to-wishlist-button-5');
    this.addToCartButton = page.locator('button[id^="add-to-cart-button-"]');
    this.addToWishlistButton = page.locator('button[id^="add-to-wishlist-button-"]');
    this.addToCompareButton = page.locator('.add-to-compare-list-button');
    this.emailAFriendButton = page.locator('.email-a-friend-button');
    this.successNotification = page.locator('#bar-notification');
    this.closeNotificationButton = page.locator('.close');
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  /**
   * Set quantity
   * @param quantity - Quantity to set
   */
  async setQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    // await this.addToCartButton.first().click();
    await this.addToCartButton.click();
  }

  /**
   * Add product to cart with quantity
   * @param quantity - Quantity to add
   */
  async addToCartWithQuantity(quantity: string): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(): Promise<void> {
    // await this.addToWishlistButton.first().click();
    await this.addToWishlistButton.click();
  }

  /**
   * Add product to compare list
   */
  async addToCompareList(): Promise<void> {
    await this.addToCompareButton.click();
  }

  /**
   * Click email a friend
   */
  async clickEmailAFriend(): Promise<void> {
    await this.emailAFriendButton.click();
  }

  /**
   * Check if success notification is visible
   */
  async isSuccessNotificationVisible(): Promise<boolean> {
    return await this.successNotification.isVisible({ timeout: 5000 });
  }

  /**
   * Get success notification text
   */
  async getSuccessNotificationText(): Promise<string | null> {
    if (await this.isSuccessNotificationVisible()) {
      return await this.successNotification.textContent();
    }
    return null;
  }

  /**
   * Close notification
   */
  async closeNotification(): Promise<void> {
    if (await this.isSuccessNotificationVisible()) {
      await this.closeNotificationButton.click();
    }
  }
}
