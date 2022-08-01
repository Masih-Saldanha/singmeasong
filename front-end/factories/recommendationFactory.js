import { faker } from '@faker-js/faker'

const URL_FRONT = 'http://localhost:3000'

const URL_BACK = 'http://localhost:5000/recommendations'

function createRecommendation () {
  return {
    name: faker.name.findName(),
    link: 'https://youtu.be/1bFz-SVX98g'
  }
};

const recommendationFactory = {
  createRecommendation,
  URL_FRONT,
  URL_BACK
}

export default recommendationFactory
