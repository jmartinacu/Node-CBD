/* eslint-disable @typescript-eslint/explicit-function-return-type */
import GroupModel, { Group } from 'src/models/group.models'

export async function createGroup (input: Group) {
  return await GroupModel.create(input)
}

export async function replaceGroup (id: string, input: Group) {
  return await GroupModel.replaceOne({ _id: id }, input)
}

export async function updateGroup (id: string, input: Partial<Group>) {
  return await GroupModel.updateOne({ _id: id }, input)
}

export async function getGroups (query: Object = {}) {
  return await GroupModel.find(query)
}

export async function getGroupById (id: string) {
  return await GroupModel.findById(id)
}

export async function getUserGroups (userId: string) {
  return await GroupModel.find({ 'users._id': userId })
}

export async function deleteGroup (id: string) {
  return await GroupModel.deleteOne({ _id: id })
}
