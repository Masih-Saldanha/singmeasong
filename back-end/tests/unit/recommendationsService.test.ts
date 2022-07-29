import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import recommendationsFactory from "../factories/recommendationsFactory.js";

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

        const promise = recommendationService.insert(recommendation)

        expect(promise).rejects.toEqual({ message: "Recommendations names must be unique", type: "conflict" });
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
    })
});
