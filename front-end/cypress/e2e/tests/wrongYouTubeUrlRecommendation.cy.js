/* eslint-disable no-undef */
/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

import recommendationFactory from '../../../factories/recommendationFactory.js'

describe('Home Screen', () => {
  it('Should add an recommendation', async () => {
    cy.resetDB()

    cy.intercept('GET', `${recommendationFactory.URL_BACK}`).as('getRecommendations')
    cy.visit(recommendationFactory.URL_FRONT)
    cy.wait('@getRecommendations')

    const recommendation = recommendationFactory.createRecommendation()
    cy.get('input[placeholder=Name]').type(recommendation.name)
    cy.get("input[placeholder='https://youtu.be/...']").type(faker.internet.url())

    cy.intercept('POST', `${recommendationFactory.URL_BACK}`).as('postRecommendation')
    cy.intercept('GET', `${recommendationFactory.URL_BACK}`).as('getNewRecommendations')
    cy.get('button').click()
    cy.wait('@postRecommendation').its('response.statusCode').should('eq', 422)
    cy.wait('@getNewRecommendations')

    cy.get('body div div').eq(5).should('contain.text', 'No recommendations yet! Create your own :)')
  })
})
