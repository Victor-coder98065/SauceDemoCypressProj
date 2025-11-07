/// <reference types='cypress' />
import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import { CartPage } from '../pageObjects/cartPage';

const cartPage = new CartPage();

Before(() => {
  cy.visit('/');
});

//#region Given Steps


//#endregion


//#region When Steps
When('I navigate to the cart page', () => {
  cy.get(cartPage.cartBadge).click();
});

When('I navigate back to the inventory page', () => {
  cy.get(cartPage.continueShoppingButton).click();
  cy.url().should('include', '/inventory.html');
});

//#endregion



//#region Then Steps
Then('the cart badge should show {string}', (expected: string) => {
  if (expected === '0') {
    cy.get(cartPage.cartBadge).should('not.exist');
  } else {
    cy.get(cartPage.cartBadge).should('have.text', expected);
  }
});


Then('I should see the first {int} products in the cart', (count: number) => {
  cy.get('.cart_item .inventory_item_name')
    .should('have.length.gte', count)
    .each(($el, index) => {
      if (index < count) {
        cy.wrap($el)
          .invoke('text')
          .should('not.be.empty');
      }
    });
});


//#endregion