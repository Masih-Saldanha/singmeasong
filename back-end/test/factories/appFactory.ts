import { faker } from "@faker-js/faker";

function createRecommendation() {
    return {
        name: faker.name.findName(),
        youtubeLink: "https://youtu.be/1bFz-SVX98g"
    };
};

// function createMoreRecommendations(amount: number) {
//     const arr = [];
//     for (let i = 0; i < amount; i++) {
//         arr.push(createRecommendation);
//     };
//     return arr;
// };

const appFactory = {
    createRecommendation,
    // createMoreRecommendations,
};

export default appFactory;