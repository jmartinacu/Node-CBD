import { Request, Response } from 'express'
import { Group } from 'src/models/group.models'
import { CreateGroupInput } from 'src/schemas/group.schemas'
import { createGroup } from 'src/services/group.services'
import { findUserById } from 'src/services/user.services'

export async function createGroupHandler (
  req: Request<{}, {}, CreateGroupInput>,
  res: Response
): Promise<Response> {
  const groupReq = req.body
  const newGroup: Group = {
    name: groupReq.name,
    users: []
  }
  for (const id of groupReq.users) {
    const userDb = await findUserById(id)
    if (userDb == null) {
      return res.status(400).send(`User with id ${id} not found`)
    }
    newGroup.users.push(userDb)
  }
  await createGroup(newGroup)
  return res.send('Group created successfully')
}
