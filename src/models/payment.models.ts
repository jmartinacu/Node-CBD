import { getModelForClass, prop, Severity, modelOptions, index, DocumentType } from '@typegoose/typegoose'

import { User } from './user.models'
import { findUserById } from 'src/services/user.services'

export const privateFields = [
  '__v'
]

@index({ payer: 1, receiver: 1 }, { unique: false })
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class Payment {
  @prop({ required: true })
    payer: string

  @prop({ required: true })
    receiver: string

  @prop({ required: true })
    amount: number

  constructor (payer: string, receiver: string, amount: number) {
    this.payer = payer
    this.receiver = receiver
    this.amount = amount
  }

  async getPayer (): Promise<DocumentType<User>> {
    const result = await findUserById(this.payer)
    if (result == null) {
      throw new Error('Payer not found')
    }
    return result
  }

  async getReceiver (): Promise<DocumentType<User>> {
    const result = await findUserById(this.receiver)
    if (result == null) {
      throw new Error('Payer not found')
    }
    return result
  }
}

const PaymentModel = getModelForClass(Payment)

export default PaymentModel
