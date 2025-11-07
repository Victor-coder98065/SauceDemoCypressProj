Feature: Cart Management

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
