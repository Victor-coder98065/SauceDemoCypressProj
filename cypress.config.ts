import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { setup, retry } from '@cypress/puppeteer';
import type { Browser as PuppeteerBrowser, Page } from 'puppeteer-core';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Setup Puppeteer
      setup({
        on,
        onMessage: {
          async switchToTabAndGetContent(browser: PuppeteerBrowser, urlPage: string, pageElement: string){
            const page = await retry<Promise<Page>>(async () => {
              const pages = await browser.pages();
              const foundPage = pages.find((p) => p.url().includes(urlPage));
              if (!foundPage) throw new Error("Could not find page");
              return foundPage;
            }, { timeout: 10000 });

            await page.bringToFront();

            try {
              const documentTitle = await page.waitForSelector(pageElement, { timeout: 60000 });
              if (!documentTitle) throw new Error(`Element ${pageElement} not found`);
              
              const documentTitleText = await page.evaluate((el) => el.textContent, documentTitle);
              return documentTitleText;
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              throw new Error(`Failed to get content from ${pageElement}: ${errorMessage}`);
            }
          },
          async switchToTabAndClickElement(browser: PuppeteerBrowser, urlPage: string, pageElement: string){
            const page = await retry<Promise<Page>>(async () => {
              const pages = await browser.pages();
              const foundPage = pages.find((p) => p.url().includes(urlPage));
              if (!foundPage) throw new Error("Could not find page");
              return foundPage;
            }, { timeout: 10000 });

            await page.bringToFront();
            
            try {
              const elementToClick = await page.waitForSelector(pageElement, { timeout: 60000 });
              if (!elementToClick) throw new Error(`Element ${pageElement} not found`);
              
              await elementToClick.scrollIntoView();
              await elementToClick.click();
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              throw new Error(`Failed to click element ${pageElement}: ${errorMessage}`);
            }
          }
        },
      });
      
      return config;
    },
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
    defaultCommandTimeout: 8000,
    chromeWebSecurity: false,
    experimentalOriginDependencies: true
  },
  env: {
    username: 'standard_user',
    password: 'secret_sauce'
  }
});