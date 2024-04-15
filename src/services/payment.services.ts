/* eslint-disable @typescript-eslint/explicit-function-return-type */
import PaymentModel, { Payment } from 'src/models/payment.models'

export async function createPayment (input: Payment) {
  return await PaymentModel.create(input)
}
