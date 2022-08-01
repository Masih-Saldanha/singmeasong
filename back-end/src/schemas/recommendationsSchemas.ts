import joi from 'joi'
import { CreateRecommendationData } from '../services/recommendationsService.js'

// eslint-disable-next-line no-useless-escape
const youtubeLinkRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/

export const recommendationSchema = joi.object<CreateRecommendationData>({
  name: joi.string().required(),
  youtubeLink: joi.string().required().pattern(youtubeLinkRegex)
})
