import { DocumentType } from "@typegoose/typegoose"
import { omit } from 'lodash'
import SessionModel from "src/models/session.models"
import { User, privateFields } from "src/models/user.models"
import { signJwt } from "src/utils/jwt"

export function signAccessToken(user: DocumentType<User>) {
   const payload = omit(user.toJSON(), privateFields)
   const accessToken = signJwt(payload, 'acessTokenPrivateKey', {
    expiresIn: '15m',
   })
   return accessToken
}

export async function createSession({ userId }: {userId: string}) {
  return SessionModel.create({user: userId}) 
}

export async function signRefreshToken({ userId }: {userId: string}) {
  const session = await createSession({ userId })
  const refreshToken = signJwt({session: session._id}, 'refreshTokenPrivateKey', {
    expiresIn: '1y'
  })
  return refreshToken
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id) 
}