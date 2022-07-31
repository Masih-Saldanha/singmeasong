/// <reference types="cypress" />

import recommendationFactory from "../../../factories/recommendationFactory.js";

describe("Home Screen", () => {
    it("Should add an recommendation", async () => {
        cy.resetDB();

        cy.intercept("GET", `${recommendationFactory.URL_BACK}`).as("getRecommendations");
        cy.visit(recommendationFactory.URL_FRONT);
        cy.wait("@getRecommendations");

        const recommendation = recommendationFactory.createRecommendation();
        cy.get("input[placeholder=Name]").type(recommendation.name);
        cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.link);

        cy.intercept("POST", `${recommendationFactory.URL_BACK}`).as("postRecommendation");
        cy.intercept("GET", `${recommendationFactory.URL_BACK}`).as("getNewRecommendations");
        cy.get("button").click();
        cy.wait("@postRecommendation");
        cy.wait("@getNewRecommendations");

        cy.get("article div:first").should("contain.text", recommendation.name);
    });
});
