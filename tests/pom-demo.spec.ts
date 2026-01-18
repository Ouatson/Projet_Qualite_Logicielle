import { test, expect } from '@playwright/test';
import { HomePage, SearchPage, ProductPage } from '../pages';

/**
 * Simple Playwright tests using Page Object Model
 * These tests demonstrate the POM pattern and validate the setup
 */

test.describe('NopCommerce Demo - Basic Tests', () => {
  test('should load home page successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateToHome();
    
    const isLogoVisible = await homePage.isLogoVisible();
    expect(isLogoVisible).toBeTruthy();
    
    const title = await homePage.getTitle();
    expect(title).toContain('nopCommerce');
  });

  test('should search for a product', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    
    await homePage.navigateToHome();
    await homePage.searchProduct('laptop');
    
    const resultsCount = await searchPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
  });

  test('should navigate to registration page', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigateToHome();
    await homePage.clickRegister();
    
    const url = await page.url();
    expect(url).toContain('register');
  });

  test('should search and view product details', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const productPage = new ProductPage(page);
    
    await homePage.navigateToHome();
    await homePage.searchProduct('laptop');
    
    const resultsCount = await searchPage.getSearchResultsCount();
    if (resultsCount > 0) {
      await searchPage.clickProduct(0);
      
      const productName = await productPage.getProductName();
      expect(productName).toBeTruthy();
      expect(productName?.length).toBeGreaterThan(0);
    }
  });
});
