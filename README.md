# SauceDemo Cypress Automation Framework

 Project Description

This project is a Cypress + Cucumber automation framework for SauceDemo
.
It covers functional testing of authentication, inventory, cart & checkout flows, role-specific quirks, and menu actions.
The framework generates Mochawesome HTML reports, screenshots, and videos of test executions.




# Prerequisites

Node.js v18+
npm v8+
Operating System: Windows / macOS / Linux
Browsers: Chrome, Electron (headless recommended for Puppeteer), Firefox (optional)




# Installation

Clone the repository:
git clone <repo_url>
cd <repo_folder>




# Install dependencies:

npm install




# Install Cypress plugins:

Badeball Cucumber Preprocessor
npm install @badeball/cypress-cucumber-preprocessor --save-dev

Esbuild plugin for Cucumber Preprocessor
npm install @badeball/cypress-cucumber-preprocessor/esbuild --save-dev

Puppeteer integration
npm install @cypress/puppeteer puppeteer-core --save-dev

Esbuild preprocessor
npm install @bahmutov/cypress-esbuild-preprocessor --save-dev

Mochawesome reporter
npm install mochawesome mochawesome-merge mochawesome-report-generator --save-dev




# Ensure your cypress.config.ts contains:

baseUrl: 'https://www.saucedemo.com',
specPattern: 'cypress/e2e/features/**/*.feature',
supportFile: 'cypress/support/e2e.ts',
video: true,
screenshotOnRunFailure: true




# Running Tests

Headless (recommended for Puppeteer tab/window tests):

npx cypress run




# Headed mode:
npx cypress open




# Run a specific feature file:
npx cypress run --spec cypress/e2e/features/cart_checkout.feature




# Cross-browser testing:
npx cypress run --browser firefox




# Project Structure
cypress/
  e2e/features/           # All feature files (15 scenarios)
  support/                # Step definitions, custom commands, plugins
  fixtures/               # Test data (users, links, checkout data)
  reports/                # Mochawesome HTML reports
cypress.config.ts         # Cypress configuration
package.json              # Dependencies
README.md                 # Documentation




# Custom Commands

Reusable actions are implemented using Cypress Custom Commands:

cy.login(username) → Logs in as a specified user

cy.addProductsToCart(count) → Adds first N products to cart

cy.removeProductsFromCart(count) → Removes first N products

cy.resetAppState() → Clears cart, restores default sort order

cy.puppeteer('switchToTabAndGetContent', url, selector) → Puppeteer helper for new tab/window





# Test Data Management

Fixtures for user credentials (users.json) and external links (links.json)

Parameterized login tests using Scenario Outline

Checkout information handled via data tables






# Known Bugs / Limitations

Scenario 10: Reset App Store link is not clickable

Scenario 12a: problem_user – All inventory images are identical (visual defect)

Visual User Issues: Cart badge placement incorrect, prices sometimes not showing 2 decimals on inventory page





# Reporting

Mochawesome HTML report: cypress/reports/mochawesome.html

Videos: cypress/videos

Screenshots on failure: cypress/screenshots





# Error Handling and Debugging

Tests include clear assertion messages

cy.log() used strategically to clarify test steps

Puppeteer errors provide descriptive messages when new tab/window operations fail





# Setup Notes

Environment variables for username and password can be configured in cypress.config.ts

Puppeteer tab/window tests require headless mode (Edge/Chrome/Electron)


















