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
export class Group {
  @prop({ required: true })
    name: string

  @prop({ default: [], type: () => [User] })
    users: User[]

  @prop({ default: 0 })
    transactionsAmount: number

  constructor (name: string, users: User[] = [], amount: number = 0) {
    this.name = name
    this.users = users
    this.transactionsAmount = amount
  }
}

const GroupModel = getModelForClass(Group)

export default GroupModel
