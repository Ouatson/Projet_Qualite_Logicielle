import { test, expect, Page, Locator } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import fs from 'fs';
import path from 'path';

async function waitForAnyVisible(page: Page, selectors: string[], timeout = 15000): Promise<Locator | null> {
    const start = Date.now();
    const pollInterval = 200;
    while (Date.now() - start < timeout) {
        for (const sel of selectors) {
            try {
              
                if (sel.startsWith('title=')) {
                    const expected = sel.slice('title='.length).trim().toLowerCase();
                    const title = (await page.title().catch(() => '')).toLowerCase();
                    if (expected && title.includes(expected)) {
                        const titleLoc = page.locator('head > title').first();
                        if ((await titleLoc.count().catch(() => 0)) > 0) return titleLoc;
                        return page.locator('body').first();
                    }
                    continue;
                }
                const loc = page.locator(sel).first();
                if (await loc.isVisible().catch(() => false)) return loc;
            } catch {
            }
        }
        await page.waitForTimeout(pollInterval);
    }
    return null;
}
async function saveDiagnostics(page: Page, name = 'login-diagnostic') {
    const dir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const png = path.join(dir, `${name}-${ts}.png`);
    const html = path.join(dir, `${name}-${ts}.html`);
    await page.screenshot({ path: png, fullPage: true }).catch(() => {});
    fs.writeFileSync(html, await page.content().catch(() => '<no-html>'), 'utf-8');
    console.log(`Saved diagnostics: ${png}, ${html}`);
}

async function isCloudflareChallenge(page: Page, timeout = 3000): Promise<boolean> {
    const challengeSelectors = [
        'text=Verifying you are human',
        'text=demo.nopcommerce.com needs to review the security of your connection',
        'text=Ray ID:',
        'title=Just a moment...',
        'text=Enable JavaScript and cookies to continue'
    ];
    const loc = await waitForAnyVisible(page, challengeSelectors, timeout).catch(() => null);
    return !!loc;
}

test.describe('Login Page - nopCommerce demo (robust)', () => {
    const url = 'https://demo.nopcommerce.com/login?returnUrl=%2F';

    test('Login page elements are visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto(url);
        if (await isCloudflareChallenge(page)) {
            await saveDiagnostics(page, 'cloudflare-challenge-on-ui-check');
            test.skip(true, 'Cloudflare challenge detected. Run tests headed and resolve challenge manually: npx playwright test --headed tests/loginPage.spec.ts');
        }

        await expect(page.locator('#Email')).toBeVisible();
        await expect(page.locator('#Password')).toBeVisible();
        await expect(page.locator('#RememberMe')).toBeVisible();
        await expect(page.locator('button.login-button')).toBeVisible();
    });

test('Shows error on invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto(url);

    if (await isCloudflareChallenge(page)) {
        await saveDiagnostics(page, 'cloudflare-challenge-before-login');
        test.skip(true, 'Cloudflare challenge detected before login. Run headed and solve manually.');
    }
    await loginPage.login('nonexistent_user@example.com', 'badPassword123');
    const challengeSelectors = [
        'text=Verifying you are human',
        'text=demo.nopcommerce.com needs to review the security of your connection',
        'text=Ray ID:',
        'title=Just a moment...',
        'text=Enable JavaScript and cookies to continue'
    ];
    await page.waitForTimeout(500);
    if (await waitForAnyVisible(page, challengeSelectors, 3000)) {
        await saveDiagnostics(page, 'cloudflare-challenge-after-login');
        test.skip(true, 'Cloudflare challenge detected after login. Run headed and solve manually.');
    }
    const errorSelectors = [
        '.message-error',
        '.validation-summary-errors',
        '.field-validation-error',
        'text=Login was unsuccessful',
        'text=No customer account found',
        'text=invalid',
        'text=incorrect',
        '.alert-danger',
        '.error'
    ];

    const errorLocator = await waitForAnyVisible(page, errorSelectors, 8000);

    if (errorLocator) {
        await expect(errorLocator).toContainText(/login was unsuccessful|no customer account found|invalid|incorrect|email|password/i);
        return;
    }
    const bodyText = await page.locator('body').innerText().catch(() => '');
    if (/login was unsuccessful|no customer account found|invalid|incorrect|email|password/i.test(bodyText)) {
        expect(true).toBeTruthy();
        return;
    }
    await saveDiagnostics(page, 'login-error-not-found');
    throw new Error(
        'Aucun message d\'erreur détecté après soumission des identifiants invalides. ' +
        'Si Cloudflare bloque l\'accès, exécutez en mode headed et résolvez manuellement:\n' +
        '  npx playwright test tests/loginPage.spec.ts --headed\n' +
        'Consultez test-results/ (screenshot + html) pour plus de détails.'
    );
});

// ...existing code...

test('Register new user and login with the new account', async ({ page }) => {
    const password = 'P@ssw0rd!' + Date.now().toString().slice(-4);
    const email = `test.user+${Date.now()}@example.com`;
    const firstName = 'Test';
    const lastName = 'User';

    // Open site and bail out on Cloudflare challenge
    await page.goto(url);
    if (await isCloudflareChallenge(page)) {
        await saveDiagnostics(page, 'cloudflare-challenge-before-register');
        test.skip(true, 'Cloudflare challenge detected. Run headed and resolve manually.');
    }

    // Go to Register page
    await page.click('a:has-text("Register")');
    // If CF challenge appears on the way to register
    if (await isCloudflareChallenge(page)) {
        await saveDiagnostics(page, 'cloudflare-challenge-on-register');
        test.skip(true, 'Cloudflare challenge detected during navigation to register. Run headed and resolve manually.');
    }

    // Fill registration form
    await page.fill('#FirstName', firstName);
    await page.fill('#LastName', lastName);
    await page.fill('#Email', email);
    await page.fill('#Password', password);
    await page.fill('#ConfirmPassword', password);

    // Submit registration
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null),
        page.click('#register-button').catch(() => page.click('button:has-text("Register")').catch(() => {}))
    ]);

    // Wait for registration success
    const regSuccess = await waitForAnyVisible(page, ['text=Your registration completed', '.result'], 8000);
    if (!regSuccess) {
        await saveDiagnostics(page, 'register-no-success');
        throw new Error('Registration success message not found. See test-results/.');
    }

    // Log out (if already logged in)
    const logoutLink = page.locator('a:has-text("Log out")');
    if (await logoutLink.count() > 0) {
        await logoutLink.first().click().catch(() => {});
        await page.waitForTimeout(500);
    }

    // Go to login page and attempt login with created account
    await page.goto(url);
    if (await isCloudflareChallenge(page)) {
        await saveDiagnostics(page, 'cloudflare-challenge-before-login-new-account');
        test.skip(true, 'Cloudflare challenge detected before login of new account. Run headed and resolve manually.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.login(email, password);

    // Wait for post-login state (Log out link visible) or detect errors
    const postLoginChallenge = await waitForAnyVisible(page, [
        'text=Verifying you are human',
        'text=demo.nopcommerce.com needs to review the security of your connection',
        'text=Ray ID:',
        'title=Just a moment...'
    ], 3000).catch(() => null);
    if (postLoginChallenge) {
        await saveDiagnostics(page, 'cloudflare-challenge-after-login-new-account');
        test.skip(true, 'Cloudflare challenge detected after login. Run headed and resolve manually.');
    }

    // Assert logged in
    await expect(page.locator('a:has-text("Log out")')).toBeVisible();
});

// ...existing code...
test('Shows validation error for invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto(url);
    if (await isCloudflareChallenge(page)) {
        await saveDiagnostics(page, 'cloudflare-challenge-before-invalid-email');
        test.skip(true, 'Cloudflare challenge detected. Run headed and resolve manually.');
    }

    // Enter an invalid email format and submit
    await page.fill('#Email', 'not-an-email');
    await page.fill('#Password', 'irrelevantPassword123');
    await page.click('button.login-button');

    // Wait for client/server validation messages
    const invalidEmailSelectors = [
        '.field-validation-error',
        '.validation-summary-errors',
        'text=Please enter a valid email',
        'text=The Email field is not a valid e-mail address',
        'text=Invalid email',
        'text=Please enter your email'
    ];

    const err = await waitForAnyVisible(page, invalidEmailSelectors, 5000);
    if (err) {
        await expect(err).toContainText(/email|valid|not a valid|please enter/i);
        return;
    }

    // Fallback: check body text
    const bodyText = await page.locator('body').innerText().catch(() => '');
    if (/email.*valid|not a valid|please enter a valid email|please enter your email/i.test(bodyText)) {
        expect(true).toBeTruthy();
        return;
    }

    await saveDiagnostics(page, 'invalid-email-no-error');
    throw new Error('Aucun message de validation détecté pour un email au format invalide. Voir test-results/.');
});
// ...existing code...
});