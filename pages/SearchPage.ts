import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly noResultsMessage: Locator;
  private readonly productItems: Locator;
  private readonly advancedSearchCheckbox: Locator;
  private readonly categoryDropdown: Locator;
  private readonly manufacturerDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.searchBox = page.locator('#q');
    this.searchButton = page.locator('button.search-button');
    this.noResultsMessage = page.locator('.no-result');
    this.productItems = page.locator('.item-box');
    this.advancedSearchCheckbox = page.locator('#advs');
    this.categoryDropdown = page.locator('#cid');
    this.manufacturerDropdown = page.locator('#mid');
  }
 
  private async waitForSearchStable(): Promise<void> {
    await Promise.race([
      this.productItems.first().waitFor({ timeout: 5000 }).catch(() => {}),
      this.noResultsMessage.waitFor({ timeout: 5000 }).catch(() => {}),
      this.page.waitForTimeout(1200)
    ]);
  }

  async search(term: string): Promise<void> {

    if (!this.page.url().includes('/search')) {
      await this.page.goto(`/search?q=${encodeURIComponent(term)}`, {
        waitUntil: 'domcontentloaded'
      });
      await this.waitForSearchStable();
      return;
    }

    if (await this.searchBox.isVisible().catch(() => false)) {
      await this.searchBox.fill(term);
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
        this.searchButton.click()
      ]);
      await this.waitForSearchStable();
    }
  }

  async getSearchResultsCount(): Promise<number> {
    await this.waitForSearchStable();
    return await this.productItems.count();
  }

  async isNoResultsMessageDisplayed(): Promise<boolean> {
    return await this.noResultsMessage.isVisible().catch(() => false);
  }

  async getNoResultsMessage(): Promise<string | null> {
    return (await this.noResultsMessage.textContent().catch(() => null))?.trim() || null;
  }

  async clickProduct(index: number): Promise<void> {
    const count = await this.productItems.count();
    if (index >= count) throw new Error('Index out of bounds');

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.productItems.nth(index).locator('.product-title a').click()
    ]);
  }

  async clickProductByName(name: string): Promise<void> {
    const link = this.page.locator('.product-title a', { hasText: name }).first();
    if (!(await link.isVisible().catch(() => false))) return;

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      link.click()
    ]);
  }

  async enableAdvancedSearch(): Promise<void> {
  await this.page.goto('/search', { waitUntil: 'domcontentloaded' });

  if (await this.advancedSearchCheckbox.isVisible().catch(() => false)) {
    const checked = await this.advancedSearchCheckbox.isChecked();
    if (!checked) {
      await this.advancedSearchCheckbox.click({ force: true });
    }
  }
}

  async selectCategory(category: string): Promise<void> {
    if (await this.categoryDropdown.isVisible().catch(() => false)) {
      await this.categoryDropdown.selectOption({ label: category });
      await this.waitForSearchStable();
    }
  }

  async selectManufacturer(manufacturer: string): Promise<void> {
    if (await this.manufacturerDropdown.isVisible().catch(() => false)) {
      await this.manufacturerDropdown.selectOption({ label: manufacturer });
      await this.waitForSearchStable();
    }
  }

  async getAllProductNames(): Promise<string[]> {
    await this.waitForSearchStable();
    return (await this.productItems.locator('.product-title a').allTextContents())
      .map(t => t.trim())
      .filter(Boolean);
  }
}
