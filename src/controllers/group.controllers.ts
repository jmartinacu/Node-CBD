import { Request, Response } from 'express'
import { omit } from 'lodash'
import { Group, privateFields as groupPrivateFields } from 'src/models/group.models'
import { User } from 'src/models/user.models'
import { CreateGroupInput, GetGroupByIdInput, UpdateGroupInput } from 'src/schemas/group.schemas'
import { UserAccessTokenPayloadInput } from 'src/schemas/user.schemas'
import { createGroup, getGroupById, getGroups, getUserGroups, replaceGroup } from 'src/services/group.services'
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
  try {
    const groups = await getGroups()
    const result = []
    for (const group of groups) {
      const groupObject = group.toObject()
      const parsedUsers = groupObject.users.map(u => omit(u, ['password', 'verificationCode', 'passwordResetCode']))
      const parsedGroup: Omit<Partial<Group>, 'users'> & { users?: Array<Partial<User>> } = omit(groupObject, groupPrivateFields)
      parsedGroup.users = parsedUsers
      result.push(parsedGroup)
    }
    return res.send(result)
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}

export async function getGroupHandler (
  req: Request<GetGroupByIdInput>,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params
    const group = await getGroupById(id)
    if (group == null) {
      return res.status(404).send('Group not found')
    }
    const groupObject = group.toObject()
    const parsedUsers = groupObject.users.map(u => omit(u, ['password', 'verificationCode', 'passwordResetCode']))
    const parsedGroup: Omit<Partial<Group>, 'users'> & { users?: Array<Partial<User>> } = omit(groupObject, groupPrivateFields)
    parsedGroup.users = parsedUsers
    return res.send(parsedGroup)
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}

export async function getUserGroupsHandler (
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const user: UserAccessTokenPayloadInput = res.locals.user
    const userGroups = await getUserGroups(user._id)
    const result = []
    for (const group of userGroups) {
      const groupObject = group.toObject()
      const parsedUsers = groupObject.users.map(u => omit(u, ['password', 'verificationCode', 'passwordResetCode']))
      const parsedGroup: Omit<Partial<Group>, 'users'> & { users?: Array<Partial<User>> } = omit(groupObject, groupPrivateFields)
      parsedGroup.users = parsedUsers
      result.push(parsedGroup)
    }
    return res.send(result)
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}

export async function updateGroupHandler (
  req: Request<GetGroupByIdInput, {}, UpdateGroupInput>,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params
    const groupDb = await getGroupById(id)
    if (groupDb == null) {
      return res.status(404).send('Group not found')
    }
    const groupReq = req.body
    const updatedUsers = []
    if (typeof groupReq.users !== 'undefined') {
      for (const id of groupReq.users) {
        const userDb = await findUserById(id)
        if (userDb == null) {
          return res.status(404).send(`User with id ${id} not found`)
        }
        updatedUsers.push(userDb)
      }
    }
    const updatedGroup: Group = {
      name: typeof groupReq.name !== 'undefined' ? groupReq.name : groupDb.name,
      users: typeof groupReq.users !== 'undefined' ? updatedUsers : groupDb.users
    }
    await replaceGroup(id, updatedGroup)
    return res.send('Group updated successfully')
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}
