import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import appFactory from "./factories/appFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`
        TRUNCATE TABLE recommendations
    `
});

describe("Recommendations tests", () => {
    it("Add a Recommendation", async () => {
        const recommendation = appFactory.createRecommendation();

        const response = await supertest(app).post("/recommendations").send(recommendation);

        const findRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name,
            }
        });

        expect(recommendation.name).toBe(findRecommendation.name);
        expect(recommendation.youtubeLink).toBe(findRecommendation.youtubeLink);
        expect(response.statusCode).toBe(201);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});