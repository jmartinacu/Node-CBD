/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { createPaymentHandler } from 'src/controllers/payment.controllers'
import validateResource from 'src/middleware/validateResource'
import { createPaymentSchema } from 'src/schemas/payment.schemas'

const router = express.Router()

router.post('api/payment',
  validateResource(createPaymentSchema),
  createPaymentHandler
)

export default router
