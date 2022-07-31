/// <reference types="cypress" />

const URL_FRONT = "http://localhost:3000";
const URL_BACK = "http://localhost:5000";

describe("Home Screen", () => {
    it("Should upvote an recommendation", async () => {
        const staticResponse = {};

        cy.intercept("GET", `${URL_BACK}/recommendations`)
            .as("getRecommendations");
        cy.visit(URL_FRONT);
        cy.wait("@getRecommendations");
        cy.log("@getRecommendations")

        cy.get("article div svg:first").click();
    });
});
