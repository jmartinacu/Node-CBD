/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { createGroupHandler } from 'src/controllers/group.controllers'
import validateResource from 'src/middleware/validateResource'
import { createGroupSchema } from 'src/schemas/group.schemas'

const router = express.Router()

router.post(
  '/api/group',
  validateResource(createGroupSchema),
  createGroupHandler
)

export default router
