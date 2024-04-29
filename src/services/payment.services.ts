/* eslint-disable @typescript-eslint/explicit-function-return-type */
import PaymentModel, { Payment } from 'src/models/payment.models'

export async function createPayment (input: Payment) {
  return await PaymentModel.create(input)
}

export async function getPaymentById (id: string) {
  return await PaymentModel.findById(id)
}

export async function getPayments (query: object = {}) {
  return await PaymentModel.find(query)
}

export async function deletePayment (id: string) {
  return await PaymentModel.deleteOne({ _id: id })
}
