Feature: Home Page Navigation
  As a user of the nopCommerce demo site
  I want to be able to navigate the home page
  So that I can access different sections of the website

  Scenario: Verify home page loads successfully
    Given I am on the home page
    Then I should see the nopCommerce logo
    And the page title should contain "nopCommerce"

  Scenario: Navigate to registration page
    Given I am on the home page
    When I click on the Register link
    Then I should be redirected to the registration page

  Scenario: Navigate to login page
    Given I am on the home page
    When I click on the Login link
    Then I should be redirected to the login page

  Scenario: Search for a product
    Given I am on the home page
    When I search for "laptop"
    Then I should see search results
    And the search results should contain products

  Scenario: Navigate to a category
    Given I am on the home page
    When I click on the "Computers" category
    Then I should be redirected to the category page
    And the page should show products in the category
