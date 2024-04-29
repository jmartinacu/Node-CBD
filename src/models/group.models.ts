import { getModelForClass, prop, Severity, index, modelOptions, DocumentType } from '@typegoose/typegoose'
import { findUsers } from 'src/services/user.services'
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
export class Group {
  @prop({ required: true })
    name: string

  @prop({ default: [] })
    users: string[]

  @prop({ default: 0 })
    transactionsAmount: number

  constructor (name: string, users: string[] = [], amount: number = 0) {
    this.name = name
    this.users = users
    this.transactionsAmount = amount
  }

  async getUsers (): Promise<Array<DocumentType<User>>> {
    return await findUsers({ _id: { $in: this.users } })
  }
}

const GroupModel = getModelForClass(Group)

export default GroupModel
