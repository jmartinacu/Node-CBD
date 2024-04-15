import { NextFunction, Request, Response } from 'express'
import { isArray } from 'lodash'
import { getGroupById } from 'src/services/group.services'
import log from 'src/utils/logger'

const deserializeGroup = async (
  req: Request,
  res: Response, next: NextFunction
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Promise<Response | void> => {
  try {
    let groupId = req.headers.group ?? ''
    if (groupId === '') {
      return next()
    }
    if (isArray(groupId) && groupId.length >= 1) {
      groupId = groupId[0]
    }
    log.info(`Hay group id: ${groupId as string}`)
    const groupDb = await getGroupById(groupId as string)
    if (groupDb !== null) {
      res.locals.group = groupDb.toObject()
    }
    return next()
  } catch (error) {
    log.error(error)
    return res.status(500).send(error)
  }
}

export default deserializeGroup
