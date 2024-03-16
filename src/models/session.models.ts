import { Ref, getModelForClass, prop } from "@typegoose/typegoose"
import { User } from "src/models/user.models"

export class Session {
  @prop({ ref: () => User})
  user: Ref<User>
  @prop({ default: true})
  valid: boolean
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  } 
})

export default SessionModel