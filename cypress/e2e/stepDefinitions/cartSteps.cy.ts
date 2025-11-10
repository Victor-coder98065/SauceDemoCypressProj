/// <reference types='cypress' />
import { Given, When, Then, Before} from '@badeball/cypress-cucumber-preprocessor';
import { CartPage } from '../pageObjects/cartPage';
import { InventoryPage } from '../pageObjects/inventoryPage';
import { DataTable } from "@badeball/cypress-cucumber-preprocessor";

const cartPage = new CartPage();
const inventoryPage = new InventoryPage();

Before(() => {
  cy.visit('/');
});


//#region When Steps
When('I proceed to checkout', () => {
  cy.get(cartPage.cartLink).click();
  cy.get(cartPage.checkoutButton).click();
});

When('I navigate directly to the cart page', () => {
  cy.get(cartPage.cartLink).click();
});

When('I navigate to the cart page', () => {
  cy.get(cartPage.cartBadge).click();
});

When('I navigate back to the inventory page', () => {
  cy.get(cartPage.continueShoppingButton).click();
  cy.url().should('include', '/inventory.html');
});

When('I proceed to checkout with customer information', (dataTable: DataTable) => {
  const [firstName, lastName, postalCode] = dataTable.rows()[0];
  cy.get(cartPage.checkoutButton).click();
  cy.get(cartPage.firstNameInput).type(firstName);
  cy.get(cartPage.lastNameInput).type(lastName);
  cy.get(cartPage.postalCodeInput).type(postalCode);
  cy.get(cartPage.continueButton).click();
});

When('I finish the checkout', () => {
  cy.get(cartPage.finishButton).click();
});

When('I click back to products button', () => {
  cy.get(cartPage.backToProductsButton).click();
});
//#endregion



//#region Then Steps
Then('the checkout overview should show zero totals', () => {
  cy.get(cartPage.subTotalLabel).should('contain.text', 'Item total: $0');
  cy.get(cartPage.taxLabel).should('contain.text', 'Tax: $0.00');
  cy.get(cartPage.totalLabel).should('contain.text', 'Total: $0.00');

  cy.get(cartPage.finishButton).should('be.visible').click();
});


Then('I should see a validation error when required fields are missing', () => {
  cy.get(cartPage.lastNameInput).type('Kabane');
  cy.get(cartPage.postalCodeInput).type('12345');
  cy.get(cartPage.continueButton).click();
  cy.get(cartPage.errorMessage).should('have.text', 'Error: First Name is required');

  cy.get(cartPage.firstNameInput).type('Victor');
  cy.get(cartPage.lastNameInput).clear();
  cy.get(cartPage.continueButton).click();
  cy.get(cartPage.errorMessage).should('have.text', 'Error: Last Name is required');

  cy.get(cartPage.lastNameInput).type('Kabane');
  cy.get(cartPage.postalCodeInput).clear();
  cy.get(cartPage.continueButton).click();
  cy.get(cartPage.errorMessage).should('have.text', 'Error: Postal Code is required');
});


Then('the success message {string} should be displayed', (message) => {
  cy.get(cartPage.successMessage).should('contain.text', message);
});

Then('the checkout overview should display correct totals and tax', () => {
  let itemTotal = 0;

  cy.get('.cart_item .inventory_item_price')
    .each(($price) => {
      const price = parseFloat($price.text().replace('$', ''));
      itemTotal += price;
    })
    .then(() => {
      const tax = parseFloat((itemTotal * 0.08).toFixed(2));
      const total = (itemTotal + tax).toFixed(2);

      cy.get('.summary_subtotal_label')
        .invoke('text')
        .should('contain', itemTotal.toFixed(2));

      cy.get('.summary_tax_label')
        .invoke('text')
        .should('contain', tax.toFixed(2));

      cy.get('.summary_total_label')
        .invoke('text')
        .should('contain', total);
    });
});



Then('the cart badge should show {string}', (expected: string) => {
  if (expected === '0') {
    cy.get(cartPage.cartBadge).should('not.exist');
  } else {
    cy.get(cartPage.cartBadge).should('have.text', expected);
  }
});


Then('I should see the first {int} products in the cart', (count: number) => {
  cy.get(inventoryPage.inventoryProducts).should('have.length.gte', count)
    .each(($item, index) => {
      if (index < count) {
        cy.wrap($item).find(inventoryPage.productNames).invoke('text').should('not.be.empty');
        cy.wrap($item).find(cartPage.cartItemQuantities).should('contain.text', '1');
      }
    });
});


//#endregion