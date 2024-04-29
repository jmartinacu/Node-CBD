/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import { createPaymentHandler, deletePaymentHandler, getPaymentsHandler, getUserPaymentsHandler } from 'src/controllers/payment.controllers'
import requireGroup from 'src/middleware/requireGroup'
import requireUser from 'src/middleware/requireUser'
import validateResource from 'src/middleware/validateResource'
import { createPaymentSchema, getPaymentByIdSchema } from 'src/schemas/payment.schemas'

const router = express.Router()

router.use(requireUser)

router.get(
  '/api/payments',
  getPaymentsHandler
)

router.get(
  '/api/payment/user',
  getUserPaymentsHandler
)

router.post('/api/payment',
  validateResource(createPaymentSchema),
  requireGroup,
  createPaymentHandler
)

router.delete('/api/payment/:id',
  validateResource(getPaymentByIdSchema),
  requireGroup,
  deletePaymentHandler
)

export default router
