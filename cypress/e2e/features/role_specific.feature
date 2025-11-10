Feature: Role-specific and menu actions
    Verifies role-specific quirks, known defects, and menu-based navigation to ensure correct behavior for different user types.

    Background: Navigating to the SauceDemo login page
        Given I am on the login page


    Scenario: External Navigation from Menu
        When I login as "standard_user"
        And I open the side menu and click "About"
        Then the Sauce Labs website should open
        And the original Swag Labs session should remain active


    Scenario: problem_user - Inventory images all show the same defective image
        When I login as "problem_user"
        Then all product images should be identical

    @focus
    Scenario: error_user - Product description fails to render correctly
        When I login as "error_user"
        When I open any product detail page
        Then the product description should show the rendering error message

    @focus
    Scenario: visual_user - Product prices and styling appear incorrect
        When I login as "visual_user"
        Then product prices and images should differ from standard values
        And styling anomalies should be visible


    Scenario: performance_glitch_user - Inventory page loads slower than standard_user
        When I login as "performance_glitch_user"
        When I load the inventory page
        Then the page load time should be slower than standard_user