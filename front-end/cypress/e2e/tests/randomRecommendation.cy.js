/// <reference types="cypress" />

import recommendationFactory from "../../../factories/recommendationFactory.js";

describe("Home Screen", () => {
    it("Should upvote an recommendation", async () => {
        cy.resetDB();
        const max = 4;
        for (let i = 0; i < max; i++) {
            cy.seedDBWithoutReset();
        };
        cy.intercept("GET", `${recommendationFactory.URL_BACK}`).as("getRecommendations");
        cy.visit(recommendationFactory.URL_FRONT);
        cy.wait("@getRecommendations");

        // cy.visit(`${recommendationFactory.URL_FRONT}/random`);
    });
});
