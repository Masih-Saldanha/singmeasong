import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import appFactory from "./factories/appFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`
        TRUNCATE TABLE recommendations
    `
});

describe("Recommendations tests - Success cases", () => {
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

    it("Get a list of 10 recommendations", async () => {
        const amount = 15;
        for (let i = 0; i < amount; i++) {
            const recommendation = appFactory.createRecommendation();
            await supertest(app).post("/recommendations").send(recommendation);
        };
        const response = await supertest(app).get("/recommendations");
        const findRecommendations = await prisma.recommendation.findMany({ take: 10, orderBy: { id: 'desc' } });

        expect(response.body.length).toBe(10);
        expect(response.body).toStrictEqual(findRecommendations);
        expect(response.statusCode).toBe(200);
    });

    it("Get a single recommendation", async () => {
        const recommendation = appFactory.createRecommendation();
        await supertest(app).post("/recommendations").send(recommendation);
        const findRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name,
            }
        });
        const id = String(findRecommendation.id);

        const response = await supertest(app).get(`/recommendations/${id}`);

        expect(response.body).toStrictEqual(findRecommendation);
        expect(response.statusCode).toBe(200);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});