import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import recommendationsFactory from "../factories/recommendationsFactory.js";
import * as errorUtils from "../../src/utils/errorUtils.js";

describe("Recommendations Service Unit Tests", () => {
    it("Insert a recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();

        jest.spyOn(recommendationRepository, "findByName")
            .mockImplementationOnce((): any => { });

        jest.spyOn(recommendationRepository, "create")
            .mockImplementationOnce((): any => { });

        await recommendationService.insert(recommendation)

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it("Do not insert a duplicated recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();

        jest.spyOn(recommendationRepository, "findByName")
            .mockImplementationOnce((): any => true);

        // jest.spyOn(errorUtils, "conflictError")
        //     .mockImplementationOnce((): any => { });

        const promise = recommendationService.insert(recommendation);
        // await recommendationService.insert(recommendation);

        expect(promise).rejects.toEqual({ message: "Recommendations names must be unique", type: "conflict" });
        // expect(recommendationRepository.findByName).toBeCalled();
        // expect(errorUtils.conflictError).toBeCalled();
    });

    it("Upvote a recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = { ...recommendation, id: 1, score: 0 };

        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => recommendationData);

        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => { });

        await recommendationService.upvote(recommendationData.id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Downvote a recommendation to -1", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = { ...recommendation, id: 1, score: 0 };
        const score = -1;

        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => recommendationData);

        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => { return { ...recommendationData, score } });

        await recommendationService.downvote(recommendationData.id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Downvote a recommendation to -6 then delete it", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = { ...recommendation, id: 1, score: 0 };
        const score = -6;

        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => recommendationData);

        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => { return { ...recommendationData, score } });

        jest.spyOn(recommendationRepository, "remove")
            .mockImplementationOnce((): any => { });

        await recommendationService.downvote(recommendationData.id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });

    it("Fail to get by recommendation Id", async () => {
        const id = 1;

        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => false);

        const response = recommendationService.getById(id);

        expect(response).rejects.toEqual({ message: "", type: "not_found" });
    });

    it("Get all recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => { });

        await recommendationService.get();

        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("Get top amount recommendations", async () => {
        const amount = 10;

        jest.spyOn(recommendationRepository, "getAmountByScore")
            .mockImplementationOnce((): any => { });

        await recommendationService.getTop(amount);

        expect(recommendationRepository.getAmountByScore).toBeCalled();
    });

    it("getRandom function test (30% scenario)", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = { ...recommendation, id: 1, score: 11 };
        const chance = 0.7;
        const index = 0;

        jest.spyOn(Math, "random")
            .mockImplementationOnce((): any => chance);

        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => [recommendationData, { ...recommendationData, id: 2 }]);

        jest.spyOn(Math, "floor")
            .mockImplementationOnce((): any => index);

        const response = await recommendationService.getRandom();

        expect(Math.random).toBeCalled();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(Math.floor).toBeCalled();
        expect(response).toBe(recommendationData);
    });

    it("getRandom function fail test (70% scenario)", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = { ...recommendation, id: 1, score: 0 };
        const chance = 0.3;
        const index = 0;

        jest.spyOn(Math, "random")
            .mockImplementationOnce((): any => chance);

        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => []);

        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => []);

        jest.spyOn(Math, "floor")
            .mockImplementationOnce((): any => index);

        const response = recommendationService.getRandom();

        expect(Math.random).toBeCalled();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(Math.floor).toBeCalled();
        expect(response).rejects.toEqual({ message: "", type: "not_found" })
    });
});
