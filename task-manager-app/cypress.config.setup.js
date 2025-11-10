// WORKSHOP CYPRESS AND ALLURE BY HAFEEZ
// THIS ARE THE INGREDIENT TO BE USED IN THE WORKSHOP

//// cypress.config.js or cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Hapus integrasi Allure
      return config;
    },
    baseUrl: "http://localhost:3000", // Ganti dengan URL aplikasi Anda
    video: true,
    screenshotOnRunFailure: true,
  },
});

//This we will be inserting into the e2e.js file
///// cypress/support/e2e.js  (or cypress/support/index.js depending on setup)
import "allure-cypress";


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

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});