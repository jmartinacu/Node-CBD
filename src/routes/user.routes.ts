/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import validateResource from 'src/middleware/validateResource'
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
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

export default router
