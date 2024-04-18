import { getModelForClass, prop, Severity, modelOptions, index, DocumentType } from '@typegoose/typegoose'

import { User } from './user.models'
import { findUserById } from 'src/services/user.services'
import { Group } from './group.models'
import { getGroupById } from 'src/services/group.services'

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
    group: string

  @prop({ required: true })
    payer: string

  @prop({ required: true })
    receiver: string

  @prop({ required: true })
    amount: number

  constructor (payer: string, receiver: string, group: string, amount: number) {
    this.payer = payer
    this.receiver = receiver
    this.group = group
    this.amount = amount
  }

  async getPayer (): Promise<DocumentType<User> | null> {
    return await findUserById(this.payer)
  }

  async getReceiver (): Promise<DocumentType<User> | null> {
    return await findUserById(this.receiver)
  }

  async getGroup (): Promise<DocumentType<Group> | null> {
    return await getGroupById(this.group)
  }
}

const PaymentModel = getModelForClass(Payment)

export default PaymentModel
