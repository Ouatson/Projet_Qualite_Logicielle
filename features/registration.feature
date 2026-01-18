Feature: User Registration
  As a new user
  I want to register an account
  So that I can access personalized features

  Background:
    Given I am on the registration page

  Scenario: Successful user registration with valid data
    When I fill in the registration form with the following details:
      | Field           | Value                        |
      | Gender          | Male                         |
      | First Name      | John                         |
      | Last Name       | Doe                          |
      | Email           | john.doe.test@example.com    |
      | Password        | Test@12345                   |
      | Confirm Password| Test@12345                   |
    And I click the Register button
    Then I should see a registration success message
    And the message should say "Your registration completed"

  Scenario: Registration fails with empty required fields
    When I click the Register button without filling the form
    Then I should see validation error messages
    And the errors should indicate required fields

  Scenario: Registration fails with mismatched passwords
    When I fill in the registration form with the following details:
      | Field           | Value                        |
      | First Name      | Jane                         |
      | Last Name       | Smith                        |
      | Email           | jane.smith.test@example.com  |
      | Password        | Test@12345                   |
      | Confirm Password| DifferentPassword123         |
    And I click the Register button
    Then I should see a password mismatch error

  Scenario: Registration with optional fields
    When I fill in the registration form with the following details:
      | Field           | Value                        |
      | Gender          | Female                       |
      | First Name      | Sarah                        |
      | Last Name       | Johnson                      |
      | Day of Birth    | 15                           |
      | Month of Birth  | May                          |
      | Year of Birth   | 1990                         |
      | Email           | sarah.johnson.test@example.com|
      | Company         | Test Company Inc             |
      | Password        | Test@12345                   |
      | Confirm Password| Test@12345                   |
    And I subscribe to the newsletter
    And I click the Register button
    Then I should see a registration success message
