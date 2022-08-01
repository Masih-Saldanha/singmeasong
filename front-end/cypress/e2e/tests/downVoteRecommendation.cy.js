/* eslint-disable no-undef */
/// <reference types="cypress" />

import recommendationFactory from '../../../factories/recommendationFactory.js'

describe('Home Screen', () => {
  it('Should upvote an recommendation', async () => {
    cy.seedDB()

    cy.intercept('GET', `${recommendationFactory.URL_BACK}`).as('getRecommendations')
    cy.visit(recommendationFactory.URL_FRONT)
    cy.wait('@getRecommendations')

    cy.intercept('POST', `${recommendationFactory.URL_BACK}/1/downvote`).as('downVote')
    cy.get('article div svg').eq(1).click()
    cy.wait('@downVote')

    cy.get('article div').eq(4).should('contain.text', -1)
  })
})
