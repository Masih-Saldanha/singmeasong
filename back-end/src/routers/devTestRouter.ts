import { Router } from 'express'

import devTestController from '../controllers/devTestController.js'

const devTestRouter = Router()

if (process.env.NODE_ENV === 'test') {
  devTestRouter.delete('/reset', devTestController.reset)
  devTestRouter.post('/seed', devTestController.seed)
};

export default devTestRouter
