import { Request, Response } from 'express'
import { Payment } from 'src/models/payment.models'

import { CreatePaymentInput } from 'src/schemas/payment.schemas'
import { createPayment } from 'src/services/payment.services'
import { findUserById } from 'src/services/user.services'
import log from 'src/utils/logger'

export async function createPaymentHandler (
  req: Request<{}, {}, CreatePaymentInput>,
  res: Response
): Promise<Response> {
  try {
    const p = req.body
    const newPayment: Payment = {
      payer: [],
      receiver: [],
      amount: p.amount
    }
    for (const id of p.payer) {
      const userDb = await findUserById(id)
      if (userDb == null) {
        return res.status(404).send(`User with id ${id} not found`)
      }
      newPayment.payer.push(userDb)
    }
    for (const id of p.receiver) {
      const userDb = await findUserById(id)
      if (userDb == null) {
        return res.status(404).send(`User with id ${id} not found`)
      }
      newPayment.receiver.push(userDb)
    }
    await createPayment(newPayment)
    return res.send('Payment created successfully')
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}
