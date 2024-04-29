import { NextFunction, Request, Response } from 'express'

import { Group } from 'src/models/group.models'
import { UserAccessTokenPayloadInput } from 'src/schemas/user.schemas'
import { findUsers } from 'src/services/user.services'

const requireGroup = async (
  _req: Request,
  res: Response,
  next: NextFunction
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Promise<Response | void> => {
  const group: Group | undefined = res.locals.group
  if (typeof group === 'undefined') {
    return res.sendStatus(401)
  }
  const user: UserAccessTokenPayloadInput | undefined = res.locals.user
  if (typeof user === 'undefined') {
    return res.sendStatus(403)
  }
  const users = await findUsers({ _id: { $in: group.users } })
  if (!users.some(u => u.email === user.email)) {
    return res.sendStatus(403)
  }
  return next()
}

export default requireGroup
