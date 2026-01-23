import { test, expect, type Page } from '@playwright/test';
import { HomePage, ProductPage, SearchPage, CartPage } from '../pages';

async function removeAllItemsFromCart(page: Page): Promise<void> {
    const removeCheckboxes = page.locator('input[name="removefromcart"]');
    const count = await removeCheckboxes.count();

    if (count === 0) return;

    for (let i = 0; i < count; i++) {
        await removeCheckboxes.nth(i).check();
    }

    const updateCartButton = page.locator('button[name="updatecart"], button.update-cart-button').first();
    await updateCartButton.click();
    await page.waitForLoadState('domcontentloaded');
}

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

test.describe('Actions that can be done for Cart Functionality', () => {
    let homePage: HomePage;
    let productPage: ProductPage;
    let searchPage: SearchPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        searchPage = new SearchPage(page);
        await homePage.navigateToHome();
        if (await isHumanCheck(page)) {
            test.skip(true, 'Cloudflare human verification detected');
        }
    });

    // test('should add product to cart from Search Page successfully', async ({ page }) => {
    //     const homePage = new HomePage(page);
    //     const productPage = new ProductPage(page);
    //     const cartPage = new CartPage(page);

    //     // Navigate to a specific product page
    //     await homePage.navigateToHome();
    //     await homePage.searchProduct('Laptop');

    //     // const firstResult = page.locator('a').first();
    //     // await expect(firstResult).toBeVisible();
    //     // await firstResult.click();

    //     // Basic smoke assertion (keeps the test compiling/running even if selectors vary)
    //     await expect(page.locator('body')).toBeVisible();

    //     // Get product name and price
    //     const productName = await productPage.getProductName();
    //     const productPrice = await productPage.getProductPrice();

    //     // Add product to cart
    //     await productPage.addToCart();

    //     // Navigate to cart page
    //     await homePage.clickShoppingCart();
    //     await expect(cartPage.getCartItems()).toContain(productName);

    //     const cartTotal = await cartPage.getCartTotal();
    //     expect(cartTotal).toBe(productPrice);
    // });

    test('should add product to cart from product Page successfully', async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        searchPage = new SearchPage(page);
        cartPage = new CartPage(page);

        // Navigate to a specific product page
        await homePage.navigateToHome();
        await homePage.searchProduct('Laptop');

        await searchPage.clickProduct(0);

        const productName = await productPage.getProductName();
        const productPrice = await productPage.getProductPrice();

        // Add product to cart
        await productPage.addToCart();

        // Navigate to cart page
        await homePage.clickShoppingCart();
        await expect(cartPage.getCartItems()).toContain(productName);

        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toBe(productPrice);
    });

    // Test to verify cart is empty after removing the product
    test('should remove product from cart successfully', async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        searchPage = new SearchPage(page);
        cartPage = new CartPage(page);

        // Navigate to a specific product page
        await homePage.navigateToHome();
        await homePage.searchProduct('Laptop');

        await searchPage.clickProduct(0);

        // Add product to cart
        await productPage.addToCart();

        // Navigate to cart page
        await homePage.clickShoppingCart();

        // Remove product from cart
        await removeAllItemsFromCart(page);
        const cartItems = await cartPage.getCartItems();
        expect(cartItems.length).toBe(0);
    });


});













// import { test, expect, type Locator, type Page } from '@playwright/test';

// function normalizeText(s: string | null | undefined): string {
//   return (s ?? '').replace(/\s+/g, ' ').trim();
// }

// function normalizePrice(s: string | null | undefined): string {
//   return normalizeText(s).replace(/\s/g, '');
// }

// async function assertNotBlockedByCloudflare(page: Page): Promise<void> {
//   // Common Cloudflare challenge signals (keep it simple + safe)
//   const title = await page.title().catch(() => '');
//   const bodyText = await page.locator('body').textContent().catch(() => '');
//   const hasChallengeText =
//     /verify you are human/i.test(title) ||
//     /verify you are human/i.test(bodyText ?? '') ||
//     /vérifier que vous êtes humain/i.test(bodyText ?? '') ||
//     /vérification.*humain/i.test(bodyText ?? '') ||
//     /needs to review the security of your connection/i.test(bodyText ?? '');

//   if (hasChallengeText) {
//     throw new Error(
//       [
//         'Blocked by Cloudflare human verification on demo.nopcommerce.com.',
//         'UI automation cannot proceed because the site serves a challenge page instead of search/product pages.',
//         'Use a local/staging nopCommerce instance without bot protection (recommended), or run headed and solve manually for local debugging only.',
//       ].join('\n')
//     );
//   }
// }

// async function waitForSearchResults(page: Page): Promise<{ links: Locator; hasResults: boolean }> {
//   const links = page.locator('.search-results h2.product-title a, .product-grid h2.product-title a');

//   try {
//     await links.first().waitFor({ state: 'visible', timeout: 30000 });
//     return { links, hasResults: true };
//   } catch {
//     // If results didn't show up, ensure we aren't blocked
//     await assertNotBlockedByCloudflare(page);

//     const noResult = page.locator('.no-result, .search-results .no-result').first();
//     await noResult.waitFor({ state: 'visible', timeout: 30000 });
//     return { links, hasResults: false };
//   }
// }

// test.describe('Cart Functionality', () => {
//   test('should add first search result to cart successfully', async ({ page }) => {
//     // Uses baseURL from playwright.config.ts
//     await page.goto('/');
//     await assertNotBlockedByCloudflare(page);

//     await page.locator('#small-searchterms').fill('Laptop');
//     await Promise.all([
//       page.waitForURL(/\/search/i, { timeout: 30000 }),
//       page.locator('button[type="submit"].search-box-button').click(),
//     ]);

//     const { links, hasResults } = await waitForSearchResults(page);
//     if (!hasResults) throw new Error('Search returned no results for "Laptop".');

//     const firstLink = links.first();
//     await expect(firstLink).toBeVisible({ timeout: 30000 });
//     await Promise.all([page.waitForLoadState('domcontentloaded'), firstLink.click()]);

//     const h1 = page.getByRole('heading', { level: 1 }).first();
//     await expect(h1).toBeVisible({ timeout: 30000 });
//     const productName = normalizeText(await h1.textContent());

//     const priceEl = page.locator('.product-price .price, .prices .price, .product-price span').first();
//     await expect(priceEl).toBeVisible({ timeout: 30000 });
//     const productPrice = normalizePrice(await priceEl.textContent());

//     const addToCartBtn = page.getByRole('button', { name: /^add to cart$/i }).first();
//     await expect(addToCartBtn).toBeVisible({ timeout: 30000 });
//     await addToCartBtn.click();

//     await Promise.all([
//       page.waitForURL(/\/cart/i, { timeout: 30000 }),
//       page.locator('a.ico-cart').click(),
//     ]);

//     await expect(page.locator('a.product-name')).toContainText(productName, { timeout: 30000 });

//     const firstSubtotal = page.locator('.cart .product-subtotal, .order-summary-content .product-subtotal').first();
//     await expect(firstSubtotal).toBeVisible({ timeout: 30000 });
//     expect(normalizePrice(await firstSubtotal.textContent())).toBe(productPrice);
//   });
// });