import { faker } from '@faker-js/faker'

function createRecommendation () {
  return {
    name: faker.name.findName(),
    youtubeLink: 'https://youtu.be/1bFz-SVX98g'
  }
};

function randomAmount (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const recommendationsFactory = {
  createRecommendation,
  randomAmount
}

export default recommendationsFactory
