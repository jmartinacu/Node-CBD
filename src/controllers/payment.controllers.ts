import { Request, Response } from 'express'

import log from 'src/utils/logger'
import { Group } from 'src/models/group.models'
import { Payment } from 'src/models/payment.models'
import { CreatePaymentInput } from 'src/schemas/payment.schemas'
import { UserAccessTokenPayloadInput } from 'src/schemas/user.schemas'
import { createPayment } from 'src/services/payment.services'
import { findUserById, updateUser } from 'src/services/user.services'
import { getDbSession } from 'src/utils/connnectToDB'

// HAY QUE CREAR LA TRANSACIÓN DE MONGO
export async function createPaymentHandler (
  req: Request<{}, {}, CreatePaymentInput>,
  res: Response
): Promise<Response> {
  const session = await getDbSession()
  session.startTransaction()
  try {
    const payer: UserAccessTokenPayloadInput = res.locals.user
    const group: Group = res.locals.group
    const { amount, receiver } = req.body
    const payerDb = await findUserById(payer._id)
    const receiverDb = await findUserById(receiver)
    if (payerDb == null) {
      return res.status(404).send(`User with id ${payer._id} not found`)
    }
    if (receiverDb == null) {
      return res.status(404).send(`User with id ${receiver} not found`)
    }
    if (!group.users.some(u => u.email === receiverDb.email)) {
      return res.send(403).send(`User with id ${receiver} not in group ${group.name}`)
    }
    const newPayment: Payment = {
      payer: payerDb,
      receiver: receiverDb,
      amount
    }
    await updateUser(payer._id, {
      deubt: payerDb.deubt + amount
    })
    await updateUser(receiver, {
      benefit: receiverDb.benefit + amount
    })
    await createPayment(newPayment)
    await session.commitTransaction()
    return res.send('Payment created successfully')
  } catch (error) {
    log.error(error)
    await session.abortTransaction()
    return res.status(500).send(error)
  } finally {
    await session.endSession()
  }
}
