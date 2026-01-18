Feature: Shopping Cart
  As a customer
  I want to add products to my cart
  So that I can purchase them later

  Background:
    Given I am on the home page

  Scenario: Add a single product to cart
    When I search for "laptop"
    And I click on the first product in the results
    And I add the product to cart
    Then I should see a success notification
    And the notification should say "The product has been added to your shopping cart"

  Scenario: Add multiple quantities of a product
    When I search for "laptop"
    And I click on the first product in the results
    And I set the product quantity to "2"
    And I add the product to cart
    Then I should see a success notification

  Scenario: View shopping cart
    When I click on the Shopping Cart link
    Then I should be redirected to the shopping cart page
    And I should see the cart contents

  Scenario: Add product to wishlist
    When I search for "laptop"
    And I click on the first product in the results
    And I add the product to wishlist
    Then I should see a success notification
    And the notification should say "The product has been added to your wishlist"
