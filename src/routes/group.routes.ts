/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { createGroupHandler, deleteGroupHandler, getGroupHandler, getGroupsHandler, getUserGroupsHandler, paymentsPerGroup, updateGroupHandler } from 'src/controllers/group.controllers'
import requireGroup from 'src/middleware/requireGroup'
import requireUser from 'src/middleware/requireUser'
import validateResource from 'src/middleware/validateResource'
import { createGroupSchema, getGroupByIdSchema, updateGroupSchema } from 'src/schemas/group.schemas'

const router = express.Router()

router.get(
  '/api/groups',
  getGroupsHandler
)

router.get(
  '/api/groups/payments',
  paymentsPerGroup
)

router.get(
  '/api/group/user',
  requireUser,
  getUserGroupsHandler
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
  requireGroup,
  updateGroupHandler
)

router.delete('/api/group/:id',
  validateResource(getGroupByIdSchema),
  requireGroup,
  deleteGroupHandler
)

export default router
