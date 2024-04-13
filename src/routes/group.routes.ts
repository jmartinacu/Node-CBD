/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { createGroupHandler, getGroupHandler, getGroupsHandler, updateGroupHandler } from 'src/controllers/group.controllers'
import validateResource from 'src/middleware/validateResource'
import { createGroupSchema, getGroupByIdSchema, updateGroupSchema } from 'src/schemas/group.schemas'

const router = express.Router()

router.get(
  '/api/groups',
  getGroupsHandler
)

router.get(
  '/api/group/:id',
  validateResource(getGroupByIdSchema),
  getGroupHandler
)

router.post(
  '/api/group',
  validateResource(createGroupSchema),
  createGroupHandler
)

router.put(
  '/api/group/:id',
  validateResource(getGroupByIdSchema),
  validateResource(updateGroupSchema),
  updateGroupHandler
)

export default router
