/* eslint-disable @typescript-eslint/explicit-function-return-type */
import UserModel, { User } from 'src/models/user.models'

export async function createUser (input: Partial<User>) {
  return await UserModel.create(input)
}

export function findUserById (id: string) {
  return UserModel.findById(id)
}

export function findUserByEmail (email: string) {
  return UserModel.findOne({ email })
}

export function findUsers (query: Object) {
  return UserModel.find(query)
}

export async function updateUser (id: string, input: Partial<User>) {
  return await UserModel.updateOne({ _id: id }, input)
}
