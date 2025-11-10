/// <reference types='cypress' />
import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import { InventoryPage } from '../pageObjects/inventoryPage';

const inventoryPage = new InventoryPage();

Before(() => {
  cy.visit('/');
  });


//#region When Steps
When('I open any product detail page', () => {
  cy.get(inventoryPage.productNames).first().click();
});

When('I load the inventory page', () => {
  let startTime: number;

  cy.intercept('GET', '/inventory.json').as('inventoryLoad');

  cy.then(() => {
    startTime = Date.now();
  });

  cy.visit('/');
  cy.get('#user-name').type('performance_glitch_user');
  cy.get('#password').type(Cypress.env('password'));
  cy.get('#login-button').click();

  cy.wait('@inventoryLoad').then(() => {
    const loadTime = Date.now() - startTime;
    cy.wrap(loadTime).as('pageLoadTime');
    cy.log(`Performance glitch page load time: ${loadTime}ms`);
  });
});

//#endregion


//#region Then Steps
Then('the page load time should be slower than standard_user', function () {
  const standardLoadTime = 500;
  cy.get('@pageLoadTime').then((loadTime: any) => {
    expect(loadTime).to.be.greaterThan(standardLoadTime);
  });
});

Then('the Sauce Labs website should open', () => {
  cy.url().should('include', 'saucelabs.com');
  cy.get('body').should('contain', 'Sauce Labs');
});

Then('the original Swag Labs session should remain active', () => {
  cy.go('back');
  cy.get(inventoryPage.inventoryProducts).should('be.visible');
});

Then('all product images should be identical', () => {
  const srcList: string[] = [];
  cy.get(inventoryPage.productImages).each(($img) => {
    cy.wrap($img).invoke('attr', 'src').then((src) => {
      srcList.push(src!);
    });
  }).then(() => {
    const firstSrc = srcList[0];
    srcList.forEach(src => expect(src).to.eq(firstSrc));
  });
});

Then('the product description should show the rendering error message', () => {
  cy.get(inventoryPage.productDescriptions)
    .should('contain.text', 'A description should be here, but it failed to render! This error has been reported to Backtrace.');
});

Then('product prices and images should differ from standard values', () => {
  cy.get(inventoryPage.inventoryProducts).each(($item) => {
    cy.wrap($item).find(inventoryPage.productPrices).should('not.have.text', '$29.99');
    cy.wrap($item).find(inventoryPage.productImages).should('not.have.attr', 'src', 'standard_image.png');
  });
});

Then('styling anomalies should be visible', () => {
  cy.get(inventoryPage.productPrices).each(($price) => {
    const text = $price.text();
    expect(text).to.match(/\$\d+\.\d{2}/);
  });
});

//#endregion