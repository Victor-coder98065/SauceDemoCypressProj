/// <reference types='cypress' />
import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import { AuthenticationPage } from '../pageObjects/authenticationPage';
import { InventoryPage } from '../pageObjects/inventoryPage';

const authPage = new AuthenticationPage();
const inventoryPage = new InventoryPage();

Before(() => {
  cy.visit('/');
});

//#region Given Steps

Given('I am on the login page', () => {
  cy.visit('/');
});

//#endregion

//#region When Steps

When('I login as {string}', (username: string) => {
  cy.fixture('users').then((users) => {
    const user = users.users.find((u: { username: string }) => u.username === username);

    if (!user) {
      throw new Error(`User ${username} not found in fixture`);
    }

    cy.get(authPage.username).clear().type(user.username);
    cy.get(authPage.password).clear().type(user.password);
    cy.get(authPage.loginButton).click();
  });
});

When('I try to log in with invalid credentials {string} and {string}', (username: string, password: string) => {
  if (username === "") cy.get(authPage.username).clear().type(" ");
  else cy.get(authPage.username).clear().type(username);

  if (password === "") cy.get(authPage.password).clear().type(" ");
  else cy.get(authPage.password).clear().type(password);

  cy.get(authPage.loginButton).click();
});

When('I remain inactive for {int} minutes', (minutes: number) => {
  const milliseconds = minutes * 60 * 1000;

  cy.clock();
  cy.tick(milliseconds);

  cy.clearCookies();
  cy.clearLocalStorage();
  
  cy.reload();
  
  cy.clock().then((clock) => clock.restore());
});

When('I open the side menu and click Logout', () => {
  cy.get(inventoryPage.menuButton).siblings('button').click();
  cy.get(inventoryPage.logoutLink).click();
});

When('I navigate back using the browser button', () => {
  cy.go('back');
});


//#endregion

//#region Then Steps

Then('I should see the inventory page with the page title {string}', (title: string) => {
  cy.url().should('include', '/inventory.html');
  cy.title().should('eq', title);
  cy.get(inventoryPage.inventoryContainer).should('be.visible');
});

Then('I should see an error message {string}', (errorMessage: string) => {
  cy.get(authPage.errorMessage).should('be.visible').and('contain', errorMessage);
});

Then('the login form should not be visible', () => {
  cy.get(authPage.username).should('not.exist');
  cy.get(authPage.password).should('not.exist');
  cy.get(authPage.loginButton).should('not.exist');
});

const verifyOnLoginPage = () => {
  cy.url().should('include', '/');
  cy.get(authPage.username).should('be.visible');
};

Then('I should be redirected to the login page', verifyOnLoginPage);
Then('I should remain on the login page', verifyOnLoginPage);

Then('I should not be able to access the inventory page', () => {
  cy.url().should('not.include', '/inventory.html');
  cy.get(authPage.username).should('be.visible');
});

//#endregion