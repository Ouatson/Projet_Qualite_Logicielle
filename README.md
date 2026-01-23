# E2E Test Automation with Playwright & Cucumber

This project contains a complete End-to-End (E2E) test automation suite for the [nopCommerce demo website](https://demo.nopcommerce.com/) using:
- **Playwright** for browser automation
- **Cucumber** with **Gherkin** syntax for BDD (Behavior-Driven Development)
- **Page Object Model (POM)** design pattern for maintainability

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Writing New Tests](#writing-new-tests)

## Features

✅ **Multi-browser Support**: Tests run on Chromium, Firefox, and WebKit  
✅ **BDD with Cucumber**: Test scenarios written in Gherkin format  
✅ **Page Object Model**: Organized, reusable page classes  
✅ **GitHub Actions**: CI/CD integration ready  
✅ **Comprehensive Coverage**: Home, Search, Registration, Shopping Cart scenarios  
✅ **TypeScript**: Type-safe test code  

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Projet
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
Projet/
├── features/                      # Cucumber BDD features
│   ├── support/                   # Cucumber support files
│   │   ├── hooks.ts              # Before/After hooks
│   │   └── world.ts              # Custom World configuration
│   ├── step-definitions/         # Step definition files
│   │   ├── home.steps.ts
│   │   ├── registration.steps.ts
│   │   ├── navigation.steps.ts
│   │   └── product.steps.ts
│   ├── home.feature             # Home page scenarios
│   ├── registration.feature     # User registration scenarios
│   ├── search.feature           # Product search scenarios
│   └── shopping-cart.feature    # Shopping cart scenarios
├── pages/                        # Page Object Model
│   ├── BasePage.ts              # Base page class
│   ├── HomePage.ts              # Home page object
│   ├── LoginPage.ts             # Login page object
│   ├── RegisterPage.ts          # Registration page object
│   ├── ProductPage.ts           # Product detail page object
│   ├── SearchPage.ts            # Search page object
│   └── index.ts                 # Page objects export
├── tests/                        # Playwright test files
│   └── example.spec.ts          # Example test (generated)
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD
├── cucumber.js                   # Cucumber configuration
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies & scripts
```

## Running Tests

### Playwright Tests

Run all Playwright tests:
```bash
npm test
```

Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

Run tests on specific browser:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

Run tests in debug mode:
```bash
npm run test:debug
```

Run tests in UI mode (interactive):
```bash
npm run test:ui
```

### Cucumber/BDD Tests

Run all Cucumber scenarios:
```bash
npm run cucumber
```

Run Cucumber with HTML report:
```bash
npm run cucumber:report
```

## Test Reports

### Playwright Reports
After running Playwright tests, view the HTML report:
```bash
npm run report
```

The report will be generated in `playwright-report/` directory.

### Cucumber Reports
Cucumber reports are generated in the `test-results/` directory:
- `cucumber-report.html` - HTML report
- `cucumber-report.json` - JSON format
- `cucumber-report.xml` - JUnit XML format

## Writing New Tests

### 1. Create a Feature File

Create a new `.feature` file in the `features/` directory:

```gherkin
Feature: Feature Name
  Description

  Scenario: Scenario Name
    Given I am on the home page
    When I perform an action
    Then I should see the expected result
```

### 2. Create Step Definitions

Create step definitions in `features/step-definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the home page', async function () {
  await this.page.goto('https://demo.nopcommerce.com');
});
```

### 3. Create Page Objects (if needed)

Create page objects in `pages/` directory extending `BasePage`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  private readonly element: Locator;

  constructor(page: Page) {
    super(page);
    this.element = page.locator('#element');
  }

  async performAction(): Promise<void> {
    await this.element.click();
  }
}
```

## Page Object Model (POM)

The Page Object Model pattern separates test logic from page structure:

- **BasePage**: Common methods for all pages (navigation, screenshots, etc.)
- **HomePage**: Home page interactions (search, navigation, links)
- **LoginPage**: Login functionality
- **RegisterPage**: User registration with validation
- **ProductPage**: Product details, add to cart/wishlist
- **SearchPage**: Search results and filtering

## BDD Feature Files

Feature files describe test scenarios in plain language using Gherkin syntax:

- **home.feature**: Home page navigation and basic functionality
- **registration.feature**: User registration with various scenarios
- **search.feature**: Product search functionality
- **shopping-cart.feature**: Shopping cart operations

## Browser Configuration

The project is configured to run tests on:
- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)

Configure browsers in `playwright.config.ts`.

### Browser Installation Issues
If browsers fail to install:
```bash
npx playwright install --force
```

### TypeScript Errors
Ensure TypeScript is properly configured:
```bash
npx tsc --noEmit
```

### Cucumber Step Not Found
Make sure step definitions are in `features/step-definitions/` and match the Gherkin syntax exactly.

### Issues (We decided to put this section in french spécifically for the presentation)

## Problèmes rencontrés

- **Soucis avec le captcha de cloudflare** : Lors de l'exécution des tests, le captcha de cloudflare bloquait l'accès au site. Pour contourner ce problème, nous avions décidé d'essayer de contourner le problème mais même en affichage guidé (headed) cloudflare suspectait l'utilisation d'un bot.
- **Quelques petits soucis avec gherkin cucumber** : Parfois, certaines étapes n'étaient pas reconnues correctement, ce qui nécessitait de vérifier la correspondance exacte entre les étapes Gherkin et les définitions des steps.