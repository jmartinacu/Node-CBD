/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import validateResource from 'src/middleware/validateResource'
import {
  createUserHandler,
  forgotPasswordHandler,
  getAverageCosts,
  getCurrentUserHandler,
  getNegativeMoneyUsers,
  getPositiveMoneyUsers,
  getTop3UsersHandler,
  resetPasswordHandler,
  verifyUserHanlder
} from 'src/controllers/user.controllers'
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema
} from 'src/schemas/user.schemas'
import requireUser from 'src/middleware/requireUser'

const router = express.Router()

router.post(
  '/api/users',
  validateResource(createUserSchema),
  createUserHandler
)

router.post(
  '/api/users/verify/:id/:verificationCode',
  validateResource(verifyUserSchema),
  verifyUserHanlder
)

router.post(
  '/api/users/forgotpassword',
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
)

router.post(
  '/api/users/resetpassword/:id/:passwordResetCode',
  validateResource(resetPasswordSchema),
  resetPasswordHandler
)

router.get(
  '/api/users/me',
  requireUser,
  getCurrentUserHandler
)

router.get(
  '/api/users/top3',
  requireUser,
  getTop3UsersHandler
)

router.get(
  '/api/users/negative',
  requireUser,
  getNegativeMoneyUsers
)

router.get(
  '/api/users/positive',
  requireUser,
  getPositiveMoneyUsers
)

router.get(
  '/api/users/avg',
  requireUser,
  getAverageCosts
)

export default router
