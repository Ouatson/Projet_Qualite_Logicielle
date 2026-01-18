Feature: Product Search
  As a customer
  I want to search for products
  So that I can find items I'm interested in purchasing

  Background:
    Given I am on the home page

  Scenario: Search for an existing product
    When I search for "computer"
    Then I should see search results
    And the search results should contain products related to "computer"

  Scenario: Search with no results
    When I search for "xyznonexistentproduct123"
    Then I should see a no results message
    And the message should say "No products were found"

  Scenario Outline: Search for different product categories
    When I search for "<searchTerm>"
    Then I should see search results
    And the search results should contain products

    Examples:
      | searchTerm |
      | laptop     |
      | phone      |
      | camera     |
      | book       |

  Scenario: Search and select a product
    When I search for "laptop"
    Then I should see search results
    When I click on the first product in the results
    Then I should be redirected to the product detail page
    And I should see the product name and price
