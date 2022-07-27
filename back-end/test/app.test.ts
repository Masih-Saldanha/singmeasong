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
    it("Add a recommendation", async () => {
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

    it("Upvote a recommendation one time", async () => {
        const recommendation = appFactory.createRecommendation();
        await supertest(app).post("/recommendations").send(recommendation);
        const findRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name,
            }
        });
        const id = String(findRecommendation.id);

        const response = await supertest(app).post(`/recommendations/${id}/upvote`);
        const findRecommendationAfterUpvote = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name,
            }
        });

        expect(findRecommendationAfterUpvote.score).toBe(1);
        expect(response.statusCode).toBe(200);
    });

    it("Downvote a recommendation one time", async () => {
        const recommendation = appFactory.createRecommendation();
        await supertest(app).post("/recommendations").send(recommendation);
        const findRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name,
            }
        });
        const id = String(findRecommendation.id);

        const response = await supertest(app).post(`/recommendations/${id}/downvote`);
        const findRecommendationAfterDownvote = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name,
            }
        });

        expect(findRecommendationAfterDownvote.score).toBe(-1);
        expect(response.statusCode).toBe(200);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});