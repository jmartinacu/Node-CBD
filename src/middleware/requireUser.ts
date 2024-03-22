import { NextFunction, Request, Response } from 'express'
import { userAccessTokenPayloadInput } from 'src/schemas/user.schemas'

const requireUser = (
  _req: Request,
  res: Response,
  next: NextFunction
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Response | void => {
  const user: userAccessTokenPayloadInput | undefined = res.locals.user
  if (typeof user === 'undefined') {
    return res.sendStatus(403)
  }
  return next()
}

export default requireUser
