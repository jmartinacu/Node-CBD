import { Request, Response } from 'express'
import { omit } from 'lodash'
import { Group, privateFields as groupPrivateFields } from 'src/models/group.models'
import { User } from 'src/models/user.models'
import { CreateGroupInput } from 'src/schemas/group.schemas'
import { createGroup, getGroups } from 'src/services/group.services'
import { findUserById } from 'src/services/user.services'
import log from 'src/utils/logger'

export async function createGroupHandler (
  req: Request<{}, {}, CreateGroupInput>,
  res: Response
): Promise<Response> {
  try {
    const groupReq = req.body
    const newGroup: Group = {
      name: groupReq.name,
      users: []
    }
    for (const id of groupReq.users) {
      const userDb = await findUserById(id)
      if (userDb == null) {
        return res.status(404).send(`User with id ${id} not found`)
      }
      newGroup.users.push(userDb)
    }
    await createGroup(newGroup)
    return res.send('Group created successfully')
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}

export async function getGroupsHandler (
  _req: Request,
  res: Response
): Promise<Response> {
  const groups = await getGroups({})
  const result = []
  for (const group of groups) {
    const groupObject = group.toObject()
    const parsedUsers = groupObject.users.map(u => omit(u, ['password', 'verificationCode', 'passwordResetCode']))
    const parsedGroup: Omit<Partial<Group>, 'users'> & { users?: Array<Partial<User>> } = omit(groupObject, groupPrivateFields)
    parsedGroup.users = parsedUsers
    result.push(parsedGroup)
  }
  return res.send(result)
}
