/// <reference types="cypress" />

import recommendationFactory from "../../../factories/recommendationFactory.js";

describe("Home Screen", () => {
    it("Should upvote an recommendation", async () => {
        cy.resetDB();
        cy.intercept("GET", `${recommendationFactory.URL_BACK}`).as("getRecommendations");
        cy.visit(recommendationFactory.URL_FRONT);
        cy.wait("@getRecommendations");

        const arrNames = [];
        const max = 3;
        for (let i = 0; i < max; i++) {
            const recommendation = recommendationFactory.createRecommendation();
            arrNames.push(recommendation.name);

            cy.get("input[placeholder=Name]").type(recommendation.name);
            cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.link);
    
            cy.intercept("POST", `${recommendationFactory.URL_BACK}`).as("postRecommendation");
            cy.intercept("GET", `${recommendationFactory.URL_BACK}`).as("getNewRecommendations");
            cy.get("button").click();
            cy.wait("@postRecommendation");
            cy.wait("@getNewRecommendations");
        };
        cy.log(arrNames);

        cy.visit(`${recommendationFactory.URL_FRONT}/random`);

        cy.get("article div").eq(0).should(($div) => {
            expect($div.get(0).innerText).to.be.oneOf(arrNames);
        });
    });
});
