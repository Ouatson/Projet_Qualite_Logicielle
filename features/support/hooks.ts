import { Before, After, Status, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
  // Optional: Setup before all tests
});

Before(async function () {
  // Launch browser before each scenario
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
  
  // Store page in cucumber world for access in step definitions
  this.page = page;
  this.context = context;
  this.browser = browser;
});

After(async function ({ pickle, result }) {
  // Take screenshot on failure
  if (result?.status === Status.FAILED) {
    const img = await page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, fullPage: true });
    this.attach(img, 'image/png');
  }
  
  // Close browser after each scenario
  await page.close();
  await context.close();
  await browser.close();
});

AfterAll(async function () {
  // Optional: Cleanup after all tests
});
