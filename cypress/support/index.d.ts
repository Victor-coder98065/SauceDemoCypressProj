/// <reference types="cypress" />
export { }
declare global {
  namespace Cypress {
    interface Chainable {
      puppeteer(messageName: string, ...args: any[]): Chainable;
    }
  }
}