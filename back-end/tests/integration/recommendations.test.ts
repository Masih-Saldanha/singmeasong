/* eslint-disable no-undef */
import supertest from 'supertest'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'

import app from '../../src/app.js'
import { prisma } from '../../src/database.js'
import recommendationsFactory from '../factories/recommendationsFactory.js'

beforeEach(async () => {
  await prisma.$executeRaw`
        ALTER SEQUENCE recommendations_id_seq RESTART WITH 1
    `
  await prisma.$executeRaw`
        TRUNCATE TABLE recommendations
    `
})

describe('Recommendations tests - Integration', () => {
  it('Add a recommendation', async () => {
    const recommendation = recommendationsFactory.createRecommendation()
    const response = await supertest(app).post('/recommendations').send(recommendation)

    const findRecommendation = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })

    expect(recommendation.name).toBe(findRecommendation.name)
    expect(recommendation.youtubeLink).toBe(findRecommendation.youtubeLink)
    expect(response.statusCode).toBe(201)
  })

  it("Don't add a recommendation due a wrong schema error", async () => {
    const wrongSchema = {}

    const response = await supertest(app).post('/recommendations').send(wrongSchema)

    expect(response.statusCode).toBe(422)
  })

  it('Upvote a recommendation one time', async () => {
    const recommendation = recommendationsFactory.createRecommendation()
    await prisma.recommendation.create({ data: recommendation })
    const findRecommendation = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })
    const id = String(findRecommendation.id)

    const response = await supertest(app).post(`/recommendations/${id}/upvote`)
    const findRecommendationAfterUpvote = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })

    expect(findRecommendationAfterUpvote.score).toBe(1)
    expect(response.statusCode).toBe(200)
  })

  it('Downvote a recommendation one time', async () => {
    const recommendation = recommendationsFactory.createRecommendation()
    await prisma.recommendation.create({ data: recommendation })
    const findRecommendation = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })
    const id = String(findRecommendation.id)

    const response = await supertest(app).post(`/recommendations/${id}/downvote`)
    const findRecommendationAfterDownvote = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })

    expect(findRecommendationAfterDownvote.score).toBe(-1)
    expect(response.statusCode).toBe(200)
  })

  it('Get a single recommendation', async () => {
    const recommendation = recommendationsFactory.createRecommendation()
    await prisma.recommendation.create({ data: recommendation })
    const findRecommendation = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })
    const id = String(findRecommendation.id)

    const response = await supertest(app).get(`/recommendations/${id}`)

    expect(response.body).toStrictEqual(findRecommendation)
    expect(response.statusCode).toBe(200)
  })

  it('Get a list of 10 recommendations', async () => {
    const min = 10
    const max = 20
    const amount = recommendationsFactory.randomAmount(min, max)
    const take = 10
    for (let i = 0; i < amount; i++) {
      const recommendation = recommendationsFactory.createRecommendation()
      await prisma.recommendation.create({ data: recommendation })
    };
    const response = await supertest(app).get('/recommendations')
    const findRecommendations = await prisma.recommendation.findMany({ take, orderBy: { id: 'desc' } })

    expect(response.body.length).toBe(take)
    expect(response.body).toStrictEqual(findRecommendations)
    expect(response.statusCode).toBe(200)
  })

  it('Get a list of top {amount} of recommendations', async () => {
    const amountOfRecommendations = 15
    for (let i = 0; i < amountOfRecommendations; i++) {
      const min = 0
      const max = 100
      const randomAmount = recommendationsFactory.randomAmount(min, max)
      const recommendation = recommendationsFactory.createRecommendation()
      await prisma.recommendation.create({ data: recommendation })
      await prisma.recommendation.update({
        where: { name: recommendation.name },
        data: {
          score: { increment: randomAmount }
        }
      })
    };

    const amount = 10
    const response = await supertest(app).get(`/recommendations/top/${amount}`)
    const findRecommendations = await prisma.recommendation.findMany({ take: amount, orderBy: { score: 'desc' } })

    expect(response.body.length).toBe(amount)
    expect(response.body).toStrictEqual(findRecommendations)
    expect(response.statusCode).toBe(200)
  })

  it('Get a random recommendation (70% scenario)', async () => {
    const minLength = 10
    const maxLength = 20
    const arrsLength = recommendationsFactory.randomAmount(minLength, maxLength)
    const minLow = -5
    const maxLow = 10
    const lowScore = recommendationsFactory.randomAmount(minLow, maxLow)
    const minHigh = 11
    const maxHigh = 20
    const highScore = recommendationsFactory.randomAmount(minHigh, maxHigh)
    const arrLowScore = []
    const arrHighScore = []
    for (let i = 0; i < arrsLength; i++) {
      arrLowScore.push({
        name: faker.name.findName(),
        youtubeLink: 'https://youtu.be/1bFz-SVX98g',
        score: lowScore
      })
      arrHighScore.push({
        name: faker.name.findName(),
        youtubeLink: 'https://youtu.be/1bFz-SVX98g',
        score: highScore
      })
    };
    const arr = arrLowScore.concat(arrHighScore)
    await prisma.recommendation.createMany({ data: arr })

    const chance = 0.3
    jest.spyOn(Math, 'random')
      .mockImplementationOnce((): any => chance)

    const response = await supertest(app).get('/recommendations/random')

    expect(response.body.score).toBeGreaterThan(10)
    expect(response.statusCode).toBe(200)
  })

  it('Get a random recommendation (30% scenario)', async () => {
    const minLength = 10
    const maxLength = 20
    const arrsLength = recommendationsFactory.randomAmount(minLength, maxLength)
    const minLow = -5
    const maxLow = 10
    const lowScore = recommendationsFactory.randomAmount(minLow, maxLow)
    const minHigh = 11
    const maxHigh = 20
    const highScore = recommendationsFactory.randomAmount(minHigh, maxHigh)
    const arrLowScore = []
    const arrHighScore = []
    for (let i = 0; i < arrsLength; i++) {
      arrLowScore.push({
        name: faker.name.findName(),
        youtubeLink: 'https://youtu.be/1bFz-SVX98g',
        score: lowScore
      })
      arrHighScore.push({
        name: faker.name.findName(),
        youtubeLink: 'https://youtu.be/1bFz-SVX98g',
        score: highScore
      })
    };
    const arr = arrLowScore.concat(arrHighScore)
    await prisma.recommendation.createMany({ data: arr })

    const chance = 0.7
    jest.spyOn(Math, 'random')
      .mockImplementationOnce((): any => chance)

    const response = await supertest(app).get('/recommendations/random')

    expect(response.body.score).toBeLessThanOrEqual(10)
    expect(response.statusCode).toBe(200)
  })

  it('Throw error on a getRandom requisition without a recommendation registered', async () => {
    const response = await supertest(app).get('/recommendations/random')

    expect(response.statusCode).toBe(404)
  })

  it('Delete an recommendation due a -6 score through downvote', async () => {
    const score = -5
    const recommendation = recommendationsFactory.createRecommendation()
    const data = { ...recommendation, score }

    const createdRecommendation = await prisma.recommendation.create({ data })
    const id = String(createdRecommendation.id)

    await supertest(app).post(`/recommendations/${id}/downvote`)

    const findRecommendation = await prisma.recommendation.findUnique({ where: { id: createdRecommendation.id } })

    expect(findRecommendation).toBeNull()
  })

  it('Throw not found error due not finding an pre-created recommendation on a upvote requisition', async () => {
    const id = '0'
    const response = await supertest(app).post(`/recommendations/${id}/upvote`)

    expect(response.statusCode).toBe(404)
  })

  it('Throw conflict error due triyng to add a repeated recommendation name', async () => {
    const recommendation = recommendationsFactory.createRecommendation()

    await prisma.recommendation.create({ data: recommendation })

    const response = await supertest(app).post('/recommendations').send(recommendation)

    expect(response.statusCode).toBe(409)
  })
})

afterAll(async () => {
  await prisma.$executeRaw`
        ALTER SEQUENCE recommendations_id_seq RESTART WITH 1
    `
  await prisma.$executeRaw`
        TRUNCATE TABLE recommendations
    `
  await prisma.$disconnect()
})
