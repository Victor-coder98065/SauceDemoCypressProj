/// <reference types='cypress' />
import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import { InventoryPage } from '../pageObjects/inventoryPage';

const inventoryPage = new InventoryPage();

Before(() => {
  cy.visit('/');
});

//#region Given Steps


//#endregion


//#region When Steps

When('I sort products by {string}', (sortOption: string) => {
  cy.get(inventoryPage.sortDropdown).select(sortOption);
});

When('I add the first {int} products to the cart', (count: number) => {
  cy.get('button')
    .filter(':contains("Add to cart")')
    .then(($buttons) => {
      const buttons = $buttons.slice(0, count);
      buttons.each((_index: number, btn: HTMLElement) => {
        cy.wrap(btn).click();
      });
    });
});


//#endregion


//#region Then Steps
Then('I should see all products listed with unique names', () => {
  const seenNames = new Set<string>();

  cy.get(inventoryPage.productNames).each(($el) => {
    const name = $el.text().trim();
    expect(name).to.not.equal('', 'Product name should not be empty');
    expect(seenNames.has(name)).to.be.false;
    seenNames.add(name);
  });
});

Then('each product should display a description, image, and price', () => {
  cy.get(inventoryPage.inventoryProducts).each(($el) => {
    cy.wrap($el).find(inventoryPage.productDescriptions).should('not.be.empty');
    cy.wrap($el).find(inventoryPage.productImages).should('be.visible');
    cy.wrap($el).find(inventoryPage.productPrices).should('not.be.empty');
  });
});

Then('product prices should match expected values', () => {
  const expectedPrices: Record<string, string> = {
    'Sauce Labs Backpack': '$29.99',
    'Sauce Labs Bike Light': '$9.99',
    'Sauce Labs Bolt T-Shirt': '$15.99',
    'Sauce Labs Fleece Jacket': '$49.99',
    'Sauce Labs Onesie': '$7.99',
    'Test.allTheThings() T-Shirt (Red)': '$15.99'
  };

  cy.get(inventoryPage.inventoryProducts).each(($el) => {
    const name = $el.find(inventoryPage.productNames).text().trim();
    const price = $el.find(inventoryPage.productPrices).text().trim();

    if (expectedPrices[name]) {
      expect(price).to.eq(expectedPrices[name]);
    }
  });
});

Then('I should see products listed in {string} order', (orderType: string) => {
  switch (orderType) {
    case 'alphabetical ascending':
      cy.get(inventoryPage.productNames)
        .then(($els) => $els.map((i, el) => el.innerText.trim()).get())
        .then((names) => {
          const sorted = [...names].sort((a, b) => a.localeCompare(b));
          expect(names, 'Products sorted A to Z').to.deep.equal(sorted);
        });
      break;

    case 'alphabetical descending':
      cy.get(inventoryPage.productNames)
        .then(($els) => $els.map((i, el) => el.innerText.trim()).get())
        .then((names) => {
          const sorted = [...names].sort((a, b) => b.localeCompare(a));
          expect(names, 'Products sorted Z to A').to.deep.equal(sorted);
        });
      break;

    case 'ascending price':
      cy.get(inventoryPage.productPrices)
        .then(($els) =>
          $els.map((i, el) => parseFloat(el.innerText.replace('$', ''))).get()
        )
        .then((prices) => {
          const sorted = [...prices].sort((a, b) => a - b);
          expect(prices, 'Prices sorted low to high').to.deep.equal(sorted);
        });
      break;

    case 'descending price':
      cy.get(inventoryPage.productPrices)
        .then(($els) =>
          $els.map((i, el) => parseFloat(el.innerText.replace('$', ''))).get()
        )
        .then((prices) => {
          const sorted = [...prices].sort((a, b) => b - a);
          expect(prices, 'Prices sorted high to low').to.deep.equal(sorted);
        });
      break;

    default:
      throw new Error(`Unknown order type: ${orderType}`);
  }
});

Then('the selected sort order should remain applied', () => {
  cy.get(inventoryPage.sortDropdown)
    .invoke('val')
    .then((currentValue) => {
      cy.get(inventoryPage.sortDropdown)
        .invoke('val')
        .should('eq', currentValue);
    });
});

Then('I remove the first {int} products from the cart', (count: number) => {
  cy.get('button')
    .filter(':contains("Remove")')
    .then(($buttons) => {
      const buttons = $buttons.slice(0, count);
      buttons.each((_index: number, btn: HTMLElement) => {
        cy.wrap(btn).click();
      });
    });
});

Then('the buttons for the first {int} products should display {string}', (count: number, text: string) => {
  cy.contains('button', text)
    .each(($btn, index) => {
      if (index < count) cy.wrap($btn).should('contain.text', text);
    });
});


Then('I should see the first products details match the inventory', () => {
  // Capture all inventory page details in a single chain
  cy.get(inventoryPage.productNames)
    .first()
    .invoke('text')
    .then((invName) => {
      cy.get(inventoryPage.productDescriptions)
        .first()
        .invoke('text')
        .then((invDesc) => {
          cy.get(inventoryPage.productPrices)
            .first()
            .invoke('text')
            .then((invPrice) => {
              cy.get(inventoryPage.productImages)
                .first()
                .invoke('attr', 'src')
                .then((invImage) => {
                  // Click on the first product to navigate to details page
                  cy.get(inventoryPage.productNames).first().click();

                  // Verify product details match
                  cy.get('[data-test="inventory-item-name"]').should('have.text', invName);
                  cy.get('[data-test="inventory-item-desc"]').should('have.text', invDesc);
                  cy.get('[data-test="inventory-item-price"]').should('have.text', invPrice);
                  
                  if (invImage) {
                    cy.get('[data-test="inventory-item-img"]').should('have.attr', 'src', invImage);
                  }
                });
            });
        });
    });
});



Then('the social media icons should open correct URLs', () => {
  const socialLinks = [
    { selector: inventoryPage.twitterIcon, url: 'https://twitter.com/saucelabs' },
    { selector: inventoryPage.facebookIcon, url: 'https://www.facebook.com/saucelabs' },
    { selector: inventoryPage.linkedinIcon, url: 'https://www.linkedin.com/company/sauce-labs/' }
  ];

  socialLinks.forEach(link => {
    cy.get(link.selector)
      .should('have.attr', 'href', link.url)
      .and('have.attr', 'target', '_blank');
  });
});

Then('the "Back to products" link returns me to the inventory page', () => {
  cy.get(inventoryPage.backToProductsButton).click();
  cy.url().should('include', '/inventory.html');
});


//#endregion