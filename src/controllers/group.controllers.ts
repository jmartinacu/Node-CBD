import { Request, Response } from 'express'
import { omit } from 'lodash'
import GroupModel, { Group, privateFields as groupPrivateFields } from 'src/models/group.models'
import { User } from 'src/models/user.models'
import { CreateGroupInput, GetGroupByIdInput, UpdateGroupInput } from 'src/schemas/group.schemas'
import { UserAccessTokenPayloadInput } from 'src/schemas/user.schemas'
import { createGroup, deleteGroup, getGroupById, getGroups, getUserGroups, replaceGroup } from 'src/services/group.services'
import { findUserById } from 'src/services/user.services'
import { getDbSession } from 'src/utils/connnectToDB'
import log from 'src/utils/logger'

export async function createGroupHandler (
  req: Request<{}, {}, CreateGroupInput>,
  res: Response
): Promise<Response> {
  try {
    const groupReq = req.body
    const newGroup = new Group(
      groupReq.name
    )
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
    const updatedGroup = new Group(
      typeof groupReq.name !== 'undefined' ? groupReq.name : groupDb.name,
      typeof groupReq.users !== 'undefined' ? updatedUsers : groupDb.users,
      typeof groupReq.transactionsAmount !== 'undefined' ? groupReq.transactionsAmount : groupDb.transactionsAmount
    )
    await replaceGroup(id, updatedGroup)
    return res.send('Group updated successfully')
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}

export async function deleteGroupHandler (
  req: Request<GetGroupByIdInput, {}, {}>,
  res: Response
): Promise<Response> {
  const session = await getDbSession()
  session.startTransaction()
  try {
    const { id } = req.params
    const groupDb = await getGroupById(id)
    if (groupDb == null) {
      return res.status(404).send('Group not found')
    }
    await deleteGroup(id)
    await session.commitTransaction()
    return res.send('Group deleted successfully')
  } catch (error) {
    log.error(error)
    await session.abortTransaction()
    return res.status(500).send(error)
  } finally {
    await session.endSession()
  }
}

export async function paymentsPerGroup (
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const groups = await GroupModel.aggregate([
      {
        $addFields:
          {
            idToString: {
              $toString: '$_id'
            }
          }
      },
      {
        $lookup:
          {
            from: 'payments',
            localField: 'idToString',
            foreignField: 'group',
            as: 'pr'
          }
      },
      {
        $addFields:
          {
            paymentCount: {
              $size: '$pr'
            }
          }
      },
      {
        $project:
          {
            name: 1,
            transactionsAmount: 1,
            paymentCount: 1
          }
      }
    ])
    return res.send(groups)
  } catch (error) {
    log.error(error)
    return res.status(500).send()
  }
}
