import { faker } from "@faker-js/faker";

function createRecommendation() {
    return {
        name: faker.name.findName(),
        youtubeLink: "https://youtu.be/1bFz-SVX98g"
    };
};

const appFactory = {
    createRecommendation,
};

export default appFactory;