/* eslint-disable no-undef */
import recommendationFactory from '../../factories/recommendationFactory.js'

Cypress.Commands.add('resetDB', () => {
  cy.request('DELETE', `${recommendationFactory.URL_BACK}/reset`).then(() => { })
})

Cypress.Commands.add('seedDB', () => {
  cy.request('DELETE', `${recommendationFactory.URL_BACK}/reset`).then(() => {
    cy.request('POST', `${recommendationFactory.URL_BACK}/seed`).then(() => { })
  })
})

Cypress.Commands.add('seedDBWithoutReset', () => {
  cy.request('POST', `${recommendationFactory.URL_BACK}/seed`).then(() => { })
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
