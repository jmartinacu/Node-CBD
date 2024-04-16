/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import { createPaymentHandler } from 'src/controllers/payment.controllers'
import requireGroup from 'src/middleware/requireGroup'
import requireUser from 'src/middleware/requireUser'
import validateResource from 'src/middleware/validateResource'
import { createPaymentSchema } from 'src/schemas/payment.schemas'

const router = express.Router()

router.use(requireUser)

router.post('/api/payment',
  validateResource(createPaymentSchema),
  requireGroup,
  createPaymentHandler
)

export default router
