
// WORKSHOP CYPRESS AND ALLURE BY HAFEEZ
// THIS ARE THE INGREDIENT TO BE USED IN THE WORKSHOP

//// cypress.config.js or cypress.config.ts
import { defineConfig } from "cypress";
import { allureCypress } from "allure-cypress/reporter";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // call allureCypress: you can pass options like resultsDir
      allureCypress(on, config, { resultsDir: "allure-results" });

      // return config for Cypress
      return config;
    },
    baseUrl: "https://example.cypress.io", 
  },
});

//This we will be inserting into the e2e.js file
///// cypress/support/e2e.js  (or cypress/support/index.js depending on setup)
import "allure-cypress";

// THIS SCRIPT WE WILL BE ADDING TO THE PACKAGE.JSON FILE TO EASE OUR USAGE OF ALLURE WITH CYPRESS
  "scripts": {
    "start": "node server/server.js",
    "dev": "node server/server.js",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "clean": "node -e \"const fs=require('fs'); ['allure-results','allure-report','cypress/screenshots','cypress/videos'].forEach(d=>{try{fs.rmSync(d,{recursive:true,force:true})}catch(e){}})\"",
    "test:login": "npm run clean && cypress run --spec \"cypress/e2e/01-login.cy.js\" --browser chrome && npx allure generate allure-results --clean -o allure-report && npx allure open allure-report"
  },

// Setting auto record video
    video: true,
// Setting auto screenshot
    screenshotOnRunFailure: true,



////////////////////// CUSTOM METHOD FOR CYPRESS TO BE ADD IN THE COMMAND.JS ///////////////////////

/**
 * Wait for toast notification
 * @param {string} message - Expected toast message
 * @param {string} type - Toast type (success, error, warning, info)
 */
Cypress.Commands.add('waitForToast', (message, type = null) => {
  if (type) {
    cy.get(`.toast.${type}`).should('be.visible');
  } else {
    cy.get('.toast').should('be.visible');
  }

  if (message) {
    cy.get('.toast-message').should('contain', message);
  }
});
// END OF WORKSHOP CYPRESS AND ALLURE BY HAFEEZ