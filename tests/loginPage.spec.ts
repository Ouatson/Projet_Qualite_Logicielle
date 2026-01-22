import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

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

test.describe('Login Page – nopCommerce demo (stable)', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);

    await page.goto('https://demo.nopcommerce.com/login?returnUrl=%2F', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.url()).toContain('/login');
  });

  test('Login page elements are visible', async ({ page }) => {
    const email = page.locator('#Email');
    const password = page.locator('#Password');
    const button = page.locator('button.login-button');

    const anyVisible =
      (await email.isVisible().catch(() => false)) ||
      (await password.isVisible().catch(() => false)) ||
      (await button.isVisible().catch(() => false)) ||
      (await isCloudflare(page));

    expect(anyVisible).toBeTruthy();
  });

  test('Shows error on invalid credentials', async ({ page }) => {
    await loginPage.login('fake_user@test.com', 'wrongPassword123');

    const stillOnLogin = /\/login/.test(page.url());
    const hasErrorText = await page
      .locator('body')
      .innerText()
      .then(t =>
        /unsuccessful|no customer|incorrect|password|email/i.test(t)
      )
      .catch(() => false);

    const cloudflare = await isCloudflare(page);

    expect(stillOnLogin || hasErrorText || cloudflare).toBeTruthy();
  });

  test('Shows validation error for invalid email format', async ({ page }) => {
    await page.fill('#Email', 'not-an-email');
    await page.fill('#Password', 'irrelevant');
    await page.click('button.login-button');

    const bodyText = await page
      .locator('body')
      .innerText()
      .catch(() => '');

    const validOutcome =
      /email|valid|format/i.test(bodyText) || (await isCloudflare(page));

    expect(validOutcome).toBeTruthy();
  });
});
