/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const URL_FRONT = "http://localhost:3000";
const URL_BACK = "http://localhost:5000";
describe("Home Screen", () => {
    it("Should add an recommendation", async () => {
        cy.visit(URL_FRONT);
        
        cy.intercept("GET", `${URL_BACK}/recommendations`).as("getRecommendations");
        cy.wait("@getRecommendations");

        const name = faker.name.findName();
        cy.get("input[placeholder=Name]").type(name);
        const link = "https://youtu.be/1bFz-SVX98g"
        cy.get("input[placeholder='https://youtu.be/...']").type(link);

        cy.intercept("POST", `${URL_BACK}/recommendations`).as("postRecommendation");
        cy.intercept("GET", `${URL_BACK}/recommendations`).as("getNewRecommendations");
        cy.get("button").click();
        cy.wait("@postRecommendation");
        cy.wait("@getNewRecommendations");

        cy.get("article div:first").should("contain.text", name);
    });
});