/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  createSessionHandler,
  refreshAccessTokenHandler
} from 'src/controllers/auth.controllers'
import validateResource from 'src/middleware/validateResource'
import { createSessionSchema } from 'src/schemas/auth.schemas'

const router = express.Router()

router.post(
  '/api/sessions',
  validateResource(createSessionSchema),
  createSessionHandler
)

router.post(
  '/api/sessions/refresh',
  refreshAccessTokenHandler
)

export default router
