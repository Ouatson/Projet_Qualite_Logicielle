# Quick Start Guide

## Installation (One-time Setup)

```bash
# Clone the repository
git clone <repository-url>
cd Projet

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Playwright Tests
```bash
# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui
```

### Cucumber/BDD Tests
```bash
# Run all Cucumber scenarios
npm run cucumber

# Run with HTML report
npm run cucumber:report

# Dry run (validate without executing)
npx cucumber-js --dry-run
```

## Viewing Reports

### Playwright Report
```bash
npm run report
```
Opens an HTML report in your browser showing test results, screenshots, videos, and traces.

### Cucumber Report
After running `npm run cucumber:report`, open:
- `test-results/cucumber-report.html` in your browser

## Project Organization

```
features/
  ├── *.feature              # Gherkin scenarios
  ├── step-definitions/      # Step implementations
  └── support/               # Hooks and configuration

pages/
  ├── BasePage.ts            # Common page methods
  └── *Page.ts               # Specific page objects

tests/
  └── *.spec.ts              # Playwright test files
```

## Writing New Tests

### 1. Add a Feature File
```gherkin
# features/my-feature.feature
Feature: My Feature
  Scenario: My test scenario
    Given I am on the home page
    When I perform an action
    Then I should see a result
```

### 2. Add Step Definitions
```typescript
// features/step-definitions/my-steps.ts
import { Given, When, Then } from '@cucumber/cucumber';

Given('I am on the home page', async function () {
  await this.page.goto('https://demo.nopcommerce.com');
});
```

### 3. Add Page Objects (Optional)
```typescript
// pages/MyPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('#my-element');
  }

  async doSomething(): Promise<void> {
    await this.myElement.click();
  }
}
```

## Common Commands

```bash
# Check TypeScript compilation
npx tsc --noEmit

# List all Cucumber scenarios
npx cucumber-js --dry-run --format summary

# Run specific test file
npx playwright test tests/pom-demo.spec.ts

# Run tests matching pattern
npx playwright test --grep "search"

# Update Playwright
npm install -D @playwright/test@latest
npx playwright install

# Clear test results
rm -rf test-results playwright-report
```

## Test Target

All tests run against: **https://demo.nopcommerce.com/**

This is a demo e-commerce website perfect for learning and testing.

## Need Help?

- See `README.md` for detailed documentation
- See `VALIDATION.md` for setup validation info
- Check Playwright docs: https://playwright.dev
- Check Cucumber docs: https://cucumber.io

## CI/CD

Tests automatically run on GitHub Actions when you:
- Push to main/master branch
- Create a pull request

View results in the "Actions" tab of your GitHub repository.
