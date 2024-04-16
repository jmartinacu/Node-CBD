import { TypeOf, number, object, string } from 'zod'

export const createPaymentSchema = object({
  body: object({
    receiver: string({
      required_error: 'Receiver is required'
    }),
    amount: number({
      required_error: 'Amount is required'
    })
  })
})

export type CreatePaymentInput = TypeOf<typeof createPaymentSchema>['body']
