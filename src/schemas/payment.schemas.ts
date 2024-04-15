import { TypeOf, number, object, string, array } from 'zod'

export const createPaymentSchema = object({
  body: object({
    payer: array(string(), {
      required_error: 'Receiver is required'
    }).min(1, 'A group must have at least one member'),
    receiver: array(string(), {
      required_error: 'Receiver is required'
    }).min(1, 'A group must have at least one member'),
    amount: number({
      required_error: 'Amount is required'
    })
  })
})

export type CreatePaymentInput = TypeOf<typeof createPaymentSchema>['body']
