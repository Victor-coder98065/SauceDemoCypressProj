import '@cypress/puppeteer/support'
// cypress/support/commands.ts

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

Cypress.Commands.add('puppeteer', (name, ...args) => {
  Cypress.log({
    name: 'puppeteer',
    message: name,
  });
 
  cy.task('__cypressPuppeteer__', { name, args }, { log: false }).then((result: any) => {
    if (result && result.__error__) {
      throw new Error(`cy.puppeteer() failed with the following error:\n> ${result.__error__.message || result.__error__}`);
    };
 
    return result
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password?: string): Chainable<Element>;
    }
  }
}
Cypress.Commands.add('login', (username: string, password = 'secret_sauce') => {
  cy.visit('/');
  cy.get('[data-test="username"]').clear().type(username);
  cy.get('[data-test="password"]').clear().type(password);
  cy.get('[data-test="login-button"]').click();
});
export {};