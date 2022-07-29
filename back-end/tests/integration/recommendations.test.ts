import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import recommendationsFactory from "../factories/recommendationsFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`
        ALTER SEQUENCE recommendations_id_seq RESTART WITH 1
    `
    await prisma.$executeRaw`
        TRUNCATE TABLE recommendations
    `
});

describe("Recommendations tests - Success cases", () => {
    it("Add a recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
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
        const recommendation = recommendationsFactory.createRecommendation();
        await prisma.recommendation.create({ data: recommendation });
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
        const recommendation = recommendationsFactory.createRecommendation();
        await prisma.recommendation.create({ data: recommendation });
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

    it("Get a single recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        await prisma.recommendation.create({ data: recommendation });
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

    it("Get a list of 10 recommendations", async () => {
        const amount = recommendationsFactory.randomAmount(10, 10);
        const take = 10;
        for (let i = 0; i < amount; i++) {
            const recommendation = recommendationsFactory.createRecommendation();
            await prisma.recommendation.create({ data: recommendation });
        };
        const response = await supertest(app).get("/recommendations");
        const findRecommendations = await prisma.recommendation.findMany({ take, orderBy: { id: 'desc' } });

        expect(response.body.length).toBe(take);
        expect(response.body).toStrictEqual(findRecommendations);
        expect(response.statusCode).toBe(200);
    });

    it("Get a list of top {amount} of recommendations", async () => {
        const amountOfRecommendations = 15;
        for (let i = 0; i < amountOfRecommendations; i++) {
            const max = 100;
            const randomAmount = recommendationsFactory.randomAmount(0, max);
            const recommendation = recommendationsFactory.createRecommendation();
            await prisma.recommendation.create({ data: recommendation });
            await prisma.recommendation.update({
                where: { name: recommendation.name },
                data: {
                    score: { increment: randomAmount },
                },
            });
        };

        const amount = 10;
        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        const findRecommendations = await prisma.recommendation.findMany({ take: amount, orderBy: { score: 'desc' } });

        expect(response.body.length).toBe(amount);
        expect(response.body).toStrictEqual(findRecommendations);
        expect(response.statusCode).toBe(200);
    });

    // TODO: CRIAR TESTE DA ROTA RANDOM
});

afterAll(async () => {
    await prisma.$disconnect();
});