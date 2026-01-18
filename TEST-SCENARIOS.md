# Test Scenarios Overview

## Feature Files Summary

### 1. Home Page Navigation (`features/home.feature`)
Tests basic navigation and home page functionality.

**Scenarios:**
1. ✅ Verify home page loads successfully
2. ✅ Navigate to registration page
3. ✅ Navigate to login page
4. ✅ Search for a product
5. ✅ Navigate to a category

**Coverage:** Home page, navigation links, search functionality, category browsing

---

### 2. User Registration (`features/registration.feature`)
Tests user account registration with various data combinations.

**Scenarios:**
1. ✅ Successful user registration with valid data
2. ✅ Registration fails with empty required fields
3. ✅ Registration fails with mismatched passwords
4. ✅ Registration with optional fields

**Coverage:** Form validation, required fields, password confirmation, optional fields (DOB, company, newsletter)

---

### 3. Product Search (`features/search.feature`)
Tests product search functionality and results handling.

**Scenarios:**
1. ✅ Search for an existing product
2. ✅ Search with no results
3. ✅ Search for different product categories (Scenario Outline)
   - laptop
   - phone
   - camera
   - book
4. ✅ Search and select a product

**Coverage:** Search functionality, no results handling, product categories, product detail navigation

---

### 4. Shopping Cart (`features/shopping-cart.feature`)
Tests shopping cart and wishlist operations.

**Scenarios:**
1. ✅ Add a single product to cart
2. ✅ Add multiple quantities of a product
3. ✅ View shopping cart
4. ✅ Add product to wishlist

**Coverage:** Add to cart, quantity selection, cart viewing, wishlist functionality

---

## Page Object Model (POM)

### BasePage
**Purpose:** Common functionality for all pages
**Methods:**
- `navigate(path)` - Navigate to a URL
- `getTitle()` - Get page title
- `waitForPageLoad()` - Wait for page to load
- `takeScreenshot(name)` - Capture screenshot
- `getCurrentURL()` - Get current URL

### HomePage
**Purpose:** Main landing page interactions
**Key Features:**
- Search functionality
- Navigation to Register/Login
- Category navigation
- Shopping cart access
- Logo verification

### LoginPage
**Purpose:** User authentication
**Key Features:**
- Login with credentials
- Remember me option
- Forgot password
- Registration redirect
- Error message handling

### RegisterPage
**Purpose:** User registration
**Key Features:**
- Complete registration form
- Gender selection
- Date of birth selection
- Newsletter subscription
- Form validation
- Success/error messages

### ProductPage
**Purpose:** Product detail interactions
**Key Features:**
- View product details
- Add to cart
- Add to wishlist
- Quantity selection
- Success notifications

### SearchPage
**Purpose:** Search results handling
**Key Features:**
- Search execution
- Results count
- Product selection
- Advanced search
- Category/manufacturer filtering
- No results handling

---

## Test Statistics

- **Total Feature Files:** 4
- **Total Scenarios:** 20
  - Including scenario outline iterations
- **Total Steps:** 87
- **Page Objects:** 6 (+ 1 base)
- **Step Definition Files:** 4
- **Support Browsers:** 3 (Chromium, Firefox, WebKit)

---

## Test Execution Matrix

| Feature | Chromium | Firefox | WebKit | BDD |
|---------|----------|---------|--------|-----|
| Home Navigation | ✅ | ✅ | ✅ | ✅ |
| User Registration | ✅ | ✅ | ✅ | ✅ |
| Product Search | ✅ | ✅ | ✅ | ✅ |
| Shopping Cart | ✅ | ✅ | ✅ | ✅ |

---

## Example Test Flows

### Happy Path: Purchase Flow
```gherkin
Given I am on the home page
When I search for "laptop"
And I click on the first product in the results
And I add the product to cart
Then I should see a success notification
When I click on the Shopping Cart link
Then I should see the cart contents
```

### Negative Test: Invalid Registration
```gherkin
Given I am on the registration page
When I click the Register button without filling the form
Then I should see validation error messages
And the errors should indicate required fields
```

### Data-Driven Test: Multiple Searches
```gherkin
Scenario Outline: Search for different product categories
  When I search for "<searchTerm>"
  Then I should see search results
  
  Examples:
    | searchTerm |
    | laptop     |
    | phone      |
    | camera     |
    | book       |
```

---

## Coverage Areas

✅ **Functional Testing**
- Navigation
- Search
- Registration
- Authentication
- Shopping cart
- Wishlist

✅ **UI Testing**
- Element visibility
- Form validation
- Error messages
- Success notifications

✅ **Cross-browser Testing**
- Chromium
- Firefox
- WebKit

✅ **BDD/Gherkin**
- Business-readable scenarios
- Reusable step definitions
- Data-driven tests

---

## How to Run Specific Tests

```bash
# Run all home page tests
npx cucumber-js features/home.feature

# Run all registration tests
npx cucumber-js features/registration.feature

# Run all search tests
npx cucumber-js features/search.feature

# Run all shopping cart tests
npx cucumber-js features/shopping-cart.feature

# Run specific scenario by name
npx cucumber-js --name "Verify home page loads successfully"

# Run tests with specific tag (if tags are added)
npx cucumber-js --tags "@smoke"
```

---

## Future Enhancements

Potential areas for expansion:
- [ ] Checkout process
- [ ] Payment methods
- [ ] Order history
- [ ] Product reviews
- [ ] Product comparison
- [ ] Customer account management
- [ ] Email verification
- [ ] Social login
- [ ] Multi-language support
- [ ] Responsive/mobile testing
