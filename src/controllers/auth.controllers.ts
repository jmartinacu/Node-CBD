import { Request, Response } from 'express'
import { get, isArray } from 'lodash'
import { CreateSessionInput } from 'src/schemas/auth.schemas'
import { findSessionById, signAccessToken, signRefreshToken } from 'src/services/auth.services'
import { findUserByEmail, findUserById } from 'src/services/user.services'
import { verifyJwt } from 'src/utils/jwt'

export async function createSessionHandler (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
): Promise<Response> {
  const { email, password } = req.body
  const user = await findUserByEmail(email)
  const msg = 'Invalid email or password'
  if (user == null) {
    return res.send(msg)
  }
  if (!user.verified) {
    return res.send('Plese verify your email')
  }
  const isValid = await user.validatePassword(password)
  if (!(isValid ?? false)) {
    return res.send(msg)
  }
  const accessToken = signAccessToken(user)
  const refreshToken = await signRefreshToken({ userId: user._id.toString() })
  return res.send({
    accessToken,
    refreshToken
  })
}

export async function refreshAccessTokenHandler (
  req: Request,
  res: Response
): Promise<Response> {
  let refreshToken = get(req, 'headers.x-refresh')
  const msg = 'Could not refresh access token'
  if (typeof refreshToken === 'undefined') {
    return res.status(400).send('Header x-refresh is required')
  }
  if (isArray(refreshToken)) {
    refreshToken = refreshToken[0]
  }
  const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublicKey')
  if (decoded == null) {
    return res.status(401).send(msg)
  }
  const session = await findSessionById(decoded.session)
  if ((session == null) || !session.valid) {
    return res.status(401).send(msg)
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const user = await findUserById(session.user.toString())

  if (user == null) {
    return res.status(401).send(msg)
  }
  const accessToken = signAccessToken(user)
  return res.send({ accessToken })
}
