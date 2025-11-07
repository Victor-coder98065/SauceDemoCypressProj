Feature: Authentication and Role-Based Access

    Background: Navigating to the SauceDemo login page
        Given I am on the login page

    Scenario Outline: Verify if each user can access the inventory page after login
        When I login as "<username>"
        Then I should see the inventory page with the page title "Swag Labs"
        And the login form should not be visible

        Examples:
            | username                |
            | standard_user           |
            | problem_user            |
            | performance_glitch_user |
            | error_user              |
            | visual_user             |


    Scenario Outline: Invalid login attempts display an error message and stay on the login page
        When I try to log in with invalid credentials "<username>" and "<password>"
        Then I should see an error message "Username and password do not match any user in this service"
        And I should remain on the login page

        Examples:
            | username     | password       |
            | invalid_user | wrong_password |
            |              | wrong_password |
            | invalid_user |                |
            |              |                |

    Scenario: Verify if locked out user cannot login
        When I login as "locked_out_user"
        Then I should see an error message "Epic sadface: Sorry, this user has been locked out."
        And I should remain on the login page


    Scenario: Session expires after inactivity and redirects to login page
        When I login as "standard_user"
        When I remain inactive for 10 minutes
        Then I should be redirected to the login page
        And I should not be able to access the inventory page

    @focus
    Scenario: Logging out ends the session and prevents access via browser navigation
        Given I login as "standard_user"
        When I open the side menu and click Logout
        Then I should be redirected to the login page
        When I navigate back using the browser button
        Then I should remain on the login page
