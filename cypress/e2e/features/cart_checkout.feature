Feature: Cart Management
    Validates adding, removing, and purchasing products, ensuring accurate cart behavior and checkout flow.

    Background: Navigating to the SauceDemo login page
        Given I am on the login page


    Scenario: Add and remove items from the cart (list view)
        When I login as "standard_user"
        And I add the first 5 products to the cart
        Then the cart badge should show "5"
        And the buttons for the first 5 products should display "Remove"
        When I navigate to the cart page
        Then I should see the first 5 products in the cart
        When I remove the first 5 products from the cart
        Then the cart badge should show "0"
        When I navigate back to the inventory page
        And the buttons for the first 5 products should display "Add to cart"


    Scenario: Complete E2E Checkout (Happy Path)
        When I login as "standard_user"
        And I add the first 5 products to the cart
        Then the cart badge should show "5"
        And the buttons for the first 5 products should display "Remove"
        When I navigate to the cart page
        Then I should see the first 5 products in the cart
        When I proceed to checkout with customer information
            | firstName | lastName | postalCode |
            | Bill      | Jack     | 12345      |
        Then the checkout overview should display correct totals and tax
        When I finish the checkout
        Then the success message "Thank you for your order!" should be displayed
        And I click back to products button
        Then the cart badge should show "0"


    Scenario: Checkout Form Validation
        When I login as "standard_user"
        And I add the first 2 products to the cart
        When I proceed to checkout
        Then I should see a validation error when required fields are missing


    Scenario: Checkout with Empty Cart
        When I login as "standard_user"
        And I navigate directly to the cart page
        And I proceed to checkout with customer information
            | firstName | lastName | postalCode |
            | Victor    | Kabane   | 12345      |
        Then the checkout overview should show zero totals
        And the success message "Thank you for your order!" should be displayed