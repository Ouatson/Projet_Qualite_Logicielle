import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 * Represents the home page of the nopCommerce demo site
 */
export class HomePage extends BasePage {
  // Locators
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly logo: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly wishlistLink: Locator;
  private readonly categoryMenu: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('button[type="submit"].search-box-button');
    this.logo = page.locator('.header-logo a');
    this.registerLink = page.locator('a.ico-register');
    this.loginLink = page.locator('a.ico-login');
    this.shoppingCartLink = page.locator('a.ico-cart');
    this.wishlistLink = page.locator('a.ico-wishlist');
    this.categoryMenu = page.locator('.top-menu');
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.navigate('/');
  }

  /**
   * Search for a product
   * @param searchTerm - Term to search for
   */
  async searchProduct(searchTerm: string): Promise<void> {
    await this.searchBox.fill(searchTerm);
    await this.searchButton.click();
  }

  /**
   * Click on register link
   */
  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }

  /**
   * Click on login link
   */
  async clickLogin(): Promise<void> {
    await this.loginLink.click();
  }

  /**
   * Click on shopping cart
   */
  async clickShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Click on wishlist
   */
  async clickWishlist(): Promise<void> {
    await this.wishlistLink.click();
  }

  /**
   * Click on a category
   * @param categoryName - Name of the category
   */
  async clickCategory(categoryName: string): Promise<void> {
    await this.page.locator(`.top-menu a:has-text("${categoryName}")`).first().click();
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }

  /**
   * Get shopping cart count
   */
  async getCartCount(): Promise<string> {
    const cartCount = await this.page.locator('.cart-qty').textContent();
    return cartCount || '0';
  }
}
