Feature: Inventory and UI Behaviors
    Validates product listing, sorting, detail pages, cart interactions, and UI state reset functionality.

    Background: Navigating to the SauceDemo login page
        Given I am on the login page

    Scenario: I verify product list integrity on the inventory page
        When I login as "standard_user"
        Then I should see all products listed with unique names
        And each product should display a description, image, and price
        And product prices should match expected values


    Scenario Outline: Verify sorting order and persistence across cart actions
        When I login as "standard_user"
        And I sort products by "<sortOption>"
        Then I should see products listed in "<orderType>" order
        When I add the first 3 products to the cart
        Then the selected sort order should remain applied
        And I remove the first 3 products from the cart
        Then the selected sort order should remain applied

        Examples:
            | sortOption          | orderType               |
            | Name (A to Z)       | alphabetical ascending  |
            | Name (Z to A)       | alphabetical descending |
            | Price (low to high) | ascending price         |
            | Price (high to low) | descending price        |


    Scenario: Product Detail Page Actions
        When I login as "standard_user"
        Then I should see the first products details match the inventory
        And the "Back to products" link returns me to the inventory page
        When I add the first 2 products to the cart
        Then the cart badge should show "2"
        When I remove the first 3 products from the cart
        Then the cart badge should show "0"
        Then the social media icons should open correct URLs


    Scenario: Reset App State clears cart, restores sort order, and resets buttons
        When I login as "standard_user"
        And I add the first 3 products to the cart
        And I sort products by "Price (low to high)"
        When I open the side menu and click "Reset App State"
        Then the cart badge should show "0"
        And the buttons for the first 3 products should display "Add to cart"
        And then I should see products listed in "alphabetical ascending" order
