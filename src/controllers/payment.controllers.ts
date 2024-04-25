import { Request, Response } from 'express'

import log from 'src/utils/logger'
import { Payment } from 'src/models/payment.models'
import { CreatePaymentInput, GetPaymentByIdInput } from 'src/schemas/payment.schemas'
import { UserAccessTokenPayloadInput } from 'src/schemas/user.schemas'
import { createPayment, deletePayment, getPaymentById, getPayments } from 'src/services/payment.services'
import { findUserById, updateUser } from 'src/services/user.services'
import { getDbSession } from 'src/utils/connnectToDB'
import { GroupRequestPayload } from 'src/schemas/group.schemas'
import { updateGroup } from 'src/services/group.services'

export async function createPaymentHandler (
  req: Request<{}, {}, CreatePaymentInput>,
  res: Response
): Promise<Response> {
  const session = await getDbSession()
  session.startTransaction()
  try {
    const payer: UserAccessTokenPayloadInput = res.locals.user
    const group: GroupRequestPayload = res.locals.group
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
      return res.status(403).send(`User with id ${receiver} not in group ${group.name}`)
    }
    const newPayment = new Payment(
      payerDb._id.toString(),
      receiverDb._id.toString(),
      group._id,
      amount
    )
    await updateUser(payer._id, {
      deubt: payerDb.deubt + amount
    })
    await updateUser(receiver, {
      benefit: receiverDb.benefit + amount
    })
    await updateGroup(group._id, { transactionsAmount: group.transactionsAmount + amount })
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

export async function getPaymentsHandler (
  _req: Request,
  res: Response
): Promise<Response> {
  const payments = await getPayments()
  return res.send(payments)
}

export async function deletePaymentHandler (
  req: Request<GetPaymentByIdInput, {}, {}>,
  res: Response
): Promise<Response> {
  const session = await getDbSession()
  session.startTransaction()
  try {
    const user: UserAccessTokenPayloadInput = res.locals.user
    const group: GroupRequestPayload = res.locals.group
    const { id } = req.params
    const paymentDb = await getPaymentById(id)
    if (paymentDb == null) {
      return res.status(404).send(`Payment with id ${id} not found`)
    }
    if (user._id !== paymentDb.payer) {
      return res.sendStatus(403)
    }
    const payerDb = await paymentDb.getPayer()
    const receiverDb = await paymentDb.getReceiver()
    if (payerDb == null || receiverDb == null) {
      return res.sendStatus(400)
    }
    if (group._id.toString() !== paymentDb.group) {
      return res.status(400).send(`This payment doesn't belongs to group ${group._id}`)
    }
    await updateUser(paymentDb.payer, {
      deubt: payerDb.deubt - paymentDb.amount
    })
    await updateUser(paymentDb.receiver, {
      benefit: receiverDb.benefit - paymentDb.amount
    })
    await updateGroup(group._id, { transactionsAmount: group.transactionsAmount - paymentDb.amount })
    await deletePayment(id)
    await session.commitTransaction()
    return res.send('Payment deleted successfully')
  } catch (error) {
    log.error(error)
    await session.abortTransaction()
    return res.status(500).send(error)
  } finally {
    await session.endSession()
  }
}
