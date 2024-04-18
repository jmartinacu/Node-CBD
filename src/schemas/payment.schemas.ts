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

export const getPaymentByIdSchema = object({
  params: object({
    id: string({ required_error: 'Payment id is mandatory' })
  })
})

export type CreatePaymentInput = TypeOf<typeof createPaymentSchema>['body']
export type GetPaymentByIdInput = TypeOf<typeof getPaymentByIdSchema>['params']
