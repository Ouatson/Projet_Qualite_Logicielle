import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Search Results Page Object
 * Represents the search results page
 */
export class SearchPage extends BasePage {
  // Locators
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly searchResults: Locator;
  private readonly noResultsMessage: Locator;
  private readonly productItems: Locator;
  private readonly advancedSearchCheckbox: Locator;
  private readonly categoryDropdown: Locator;
  private readonly manufacturerDropdown: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.searchBox = page.locator('#q');
    this.searchButton = page.locator('button.search-button');
    this.searchResults = page.locator('.search-results');
    this.noResultsMessage = page.locator('.no-result');
    this.productItems = page.locator('.product-item');
    this.advancedSearchCheckbox = page.locator('#advs');
    this.categoryDropdown = page.locator('#cid');
    this.manufacturerDropdown = page.locator('#mid');
  }

  /**
   * Search for a product
   * @param searchTerm - Term to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.searchBox.fill(searchTerm);
    await this.searchButton.click();
  }

  /**
   * Get search results count
   */
  async getSearchResultsCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Check if no results message is displayed
   */
  async isNoResultsMessageDisplayed(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  /**
   * Get no results message text
   */
  async getNoResultsMessage(): Promise<string | null> {
    if (await this.isNoResultsMessageDisplayed()) {
      return await this.noResultsMessage.textContent();
    }
    return null;
  }

  /**
   * Click on a product by index
   * @param index - Product index (0-based)
   */
  async clickProduct(index: number): Promise<void> {
    await this.productItems.nth(index).locator('.product-title a').click();
  }

  /**
   * Click on a product by name
   * @param productName - Product name
   */
  async clickProductByName(productName: string): Promise<void> {
    await this.page.locator(`.product-title a:has-text("${productName}")`).first().click();
  }

  /**
   * Enable advanced search
   */
  async enableAdvancedSearch(): Promise<void> {
    await this.advancedSearchCheckbox.check();
  }

  /**
   * Select category
   * @param category - Category name
   */
  async selectCategory(category: string): Promise<void> {
    await this.categoryDropdown.selectOption({ label: category });
  }

  /**
   * Select manufacturer
   * @param manufacturer - Manufacturer name
   */
  async selectManufacturer(manufacturer: string): Promise<void> {
    await this.manufacturerDropdown.selectOption({ label: manufacturer });
  }

  /**
   * Get all product names
   */
  async getAllProductNames(): Promise<string[]> {
    const titles = await this.productItems.locator('.product-title a').allTextContents();
    return titles;
  }
}
