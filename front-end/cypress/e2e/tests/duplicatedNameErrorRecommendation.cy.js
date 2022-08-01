/* eslint-disable no-undef */
/// <reference types="cypress" />

import recommendationFactory from '../../../factories/recommendationFactory.js'

describe('Home Screen', () => {
  it('Should add an recommendation', async () => {
    cy.resetDB()

    cy.intercept('GET', `${recommendationFactory.URL_BACK}`).as('getRecommendations')
    cy.visit(recommendationFactory.URL_FRONT)
    cy.wait('@getRecommendations')

    const recommendation = recommendationFactory.createRecommendation()

    const inserts = 3
    for (let i = 0; i < inserts; i++) {
      cy.get('input[placeholder=Name]').type(recommendation.name)
      cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.link)

      cy.intercept('POST', `${recommendationFactory.URL_BACK}`).as('postRecommendation')
      cy.intercept('GET', `${recommendationFactory.URL_BACK}`).as('getNewRecommendations')
      cy.get('button').click()
      cy.wait('@postRecommendation')
      cy.wait('@getNewRecommendations')

      if (i >= 1) {
        cy.wait('@postRecommendation').its('response.statusCode').should('eq', 409)
      }
    }

    cy.get('article div:first').should('contain.text', recommendation.name)
  })
})
