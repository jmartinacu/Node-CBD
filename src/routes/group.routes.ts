/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { createGroupHandler, getGroupsHandler } from 'src/controllers/group.controllers'
import validateResource from 'src/middleware/validateResource'
import { createGroupSchema } from 'src/schemas/group.schemas'

const router = express.Router()

router.get(
  '/api/groups',
  getGroupsHandler
)

router.post(
  '/api/group',
  validateResource(createGroupSchema),
  createGroupHandler
)

export default router
