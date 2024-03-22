import jwt from 'jsonwebtoken'
import config from 'config'

export function signJwt (
  object: Object,
  keyName: 'acessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
): string {
  const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
  return jwt.sign(object, signingKey, {
    ...((options != null) && options),
    algorithm: 'RS256'
  })
}

export function verifyJwt<T> (token: string,
  keyName: 'acessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
  try {
    const decoded = jwt.verify(token, publicKey) as T
    return decoded
  } catch (error) {
    return null
  }
}
