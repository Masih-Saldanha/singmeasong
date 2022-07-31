/// <reference types="cypress" />

import recommendationFactory from "../../../factories/recommendationFactory.js";

describe("Home Screen", () => {
    it("Should upvote an recommendation", async () => {
        cy.resetDB();
        const max = 3;
        for (let i = 0; i < max; i++) {
            cy.seedDBWithoutReset();
        };
        cy.intercept("GET", `${recommendationFactory.URL_BACK}`).as("getRecommendations");
        cy.visit(recommendationFactory.URL_FRONT);
        cy.wait("@getRecommendations");

        for (let i = max; i > 0; i--) {
            const svgIndex = (max - i) * 2;
            cy.log(i, svgIndex);
            for (let j = max; j >= i; j--) {
                cy.intercept("POST", `${recommendationFactory.URL_BACK}/${i}/upvote`).as("upVote");
                cy.get("article div svg").eq(svgIndex).click();
                cy.wait("@upVote");
            };
        };

        cy.visit(`${recommendationFactory.URL_FRONT}/top`);

        for (let k = 0; k < max; k++) {
            cy.get("article div").eq(4 + (k * 5)).should("contain.text", max - k);
        }
    });
});
