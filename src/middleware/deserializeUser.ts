import { NextFunction, Request, Response } from 'express'
import { UserAccessTokenPayloadInput } from 'src/schemas/user.schemas'
import { verifyJwt } from 'src/utils/jwt'

const deserializeUser = async (
  req: Request,
  res: Response, next: NextFunction
): Promise<void> => {
  const accessToken = (req.headers.authorization ?? '').replace(/^Bearer\s/, '')
  if (accessToken === '') {
    return next()
  }
  const decoded = verifyJwt<UserAccessTokenPayloadInput>(accessToken, 'acessTokenPublicKey')
  if (decoded !== null) {
    res.locals.user = decoded
  }
  return next()
}

export default deserializeUser
