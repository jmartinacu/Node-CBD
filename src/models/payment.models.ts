import { getModelForClass, prop, Severity, index, modelOptions } from '@typegoose/typegoose'

import { User } from './user.models'

export const privateFields = [
  '__v'
]

@index({ name: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class Payment {
  @prop({ required: true, type: () => User })
    payer: User

  @prop({ required: true, type: () => User })
    receiver: User

  @prop({ required: true })
    amount: number
}

const PaymentModel = getModelForClass(Payment)

export default PaymentModel
