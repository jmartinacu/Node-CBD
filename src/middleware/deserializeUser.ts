import { NextFunction, Request, Response } from "express"
import { verifyJwt } from "src/utils/jwt"

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '')
  if (!accessToken) {
    return next()
  }
  const decoded = verifyJwt(accessToken, 'acessTokenPublicKey')
  if (decoded) {
    res.locals.user = decoded;  
  }
  return next()
}

export default deserializeUser