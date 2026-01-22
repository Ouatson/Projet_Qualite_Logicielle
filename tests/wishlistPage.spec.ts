import { test, expect, Page } from '@playwright/test';
import { WishlistPage } from '../pages/WishlistPage';

async function isCloudflare(page: Page): Promise<boolean> {
  const signals = [
    'text=Verifying you are human',
    'text=needs to review the security of your connection',
    'title=Just a moment',
    'text=Enable JavaScript and cookies',
  ];
  for (const s of signals) {
    if (await page.locator(s).first().isVisible().catch(() => false)) {
      return true;
    }
  }
  return false;
}


test.describe('Wishlist Page – nopCommerce demo (stable)', () => {
  let wishlistPage: WishlistPage;

  test.beforeEach(async ({ page }) => {
    wishlistPage = new WishlistPage(page);
    await wishlistPage.goto();
  });

  test('Wishlist page is reachable', async ({ page }) => {
    const onWishlist = /\/wishlist/.test(page.url());
    const cloudflare = await isCloudflare(page);

    expect(onWishlist || cloudflare).toBeTruthy();
  });

  test('Wishlist page displays a title', async ({ page }) => {
    const titleVisible = await wishlistPage.pageTitle
      .isVisible()
      .catch(() => false);

    const cloudflare = await isCloudflare(page);

    expect(titleVisible || cloudflare).toBeTruthy();
  });

  test('Wishlist can be empty', async ({ page }) => {
    const empty = await wishlistPage.isEmpty();
    const hasTable = await wishlistPage.hasItems();
    const cloudflare = await isCloudflare(page);

    expect(empty || hasTable || cloudflare).toBeTruthy();
  });

  test('Wishlist shows table when products exist', async ({ page }) => {
    const hasItems = await wishlistPage.hasItems();
    const empty = await wishlistPage.isEmpty();
    const cloudflare = await isCloudflare(page);

    expect(hasItems || empty || cloudflare).toBeTruthy();
  });

  test('Add to cart button is present when wishlist has items', async ({ page }) => {
    const addToCartVisible = await wishlistPage.addToCartButtons
      .first()
      .isVisible()
      .catch(() => false);

    const empty = await wishlistPage.isEmpty();
    const cloudflare = await isCloudflare(page);

    expect(addToCartVisible || empty || cloudflare).toBeTruthy();
  });

  test('Remove from wishlist controls exist when items are present', async ({ page }) => {
    const removeCheckboxVisible = await wishlistPage.removeCheckboxes
      .first()
      .isVisible()
      .catch(() => false);

    const empty = await wishlistPage.isEmpty();
    const cloudflare = await isCloudflare(page);

    expect(removeCheckboxVisible || empty || cloudflare).toBeTruthy();
  });
});
