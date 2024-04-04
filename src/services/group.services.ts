/* eslint-disable @typescript-eslint/explicit-function-return-type */
import GroupModel, { Group } from 'src/models/group.models'

export async function createGroup (input: Partial<Group>) {
  return await GroupModel.create(input)
}

export async function getGroups (query: Object) {
  return await GroupModel.find(query).exec()
}
