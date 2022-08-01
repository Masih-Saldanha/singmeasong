import { Request, Response } from 'express'

import devTestService from '../services/devTestService.js'

async function reset (req: Request, res: Response) {
  await devTestService.reset()

  res.sendStatus(200)
};

async function seed (req: Request, res: Response) {
  await devTestService.seed()

  res.sendStatus(200)
};

const devTestController = {
  reset,
  seed
}

export default devTestController
