import { Request, Response } from 'express'

import log from 'src/utils/logger'
import sendEmail from 'src/utils/mailer'
import { CreateUserInput, ForgotPasswordInput, VerifyUserInput, ResetPasswordInput } from 'src/schemas/user.schemas'
import { createUser, findUserById, findUserByEmail } from 'src/services/user.services'
import { nanoid } from 'nanoid'

export async function createUserHandler (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<Response> {
  const body = req.body
  try {
    const user = await createUser(body)
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Please verify your account',
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      text: `verification code ${user.verificationCode}. Id: ${user._id}`
    })
    return res.send('User successfully created')
  } catch (error: any) {
    log.error(error)
    if (error.code === 11000) {
      return res.status(409).send('Account already exists')
    }
    return res.status(500).send(error)
  }
}

export async function verifyUserHanlder (
  req: Request<VerifyUserInput>,
  res: Response
): Promise<Response> {
  const id = req.params.id
  const verificationCode = req.params.verificationCode
  const user = await findUserById(id)
  if (user == null) {
    return res.send('Could not verify user')
  }
  if (user.verified) {
    return res.send('User is already verified')
  }
  if (user.verificationCode !== verificationCode) {
    return res.send('Could not verify user')
  }
  user.verified = true
  await user.save()
  return res.send('User successfully verified')
}

export async function forgotPasswordHandler (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
): Promise<Response> {
  const { email } = req.body
  const user = await findUserByEmail(email)
  const msg = 'If a user with that email is registered you will receive a password reset email'
  if (user == null) {
    log.debug(`User with email ${email} does not exists`)
    return res.send(msg)
  }
  if (!user.verified) {
    return res.send('User is not verified')
  }
  const passwordResetCode = nanoid()
  user.passwordResetCode = passwordResetCode
  await user.save()
  await sendEmail({
    to: user.email,
    from: 'test@example.com',
    subject: 'Reset your password',
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    text: `Password reset code ${passwordResetCode}. Id ${user._id}`
  })
  log.debug(`Password reset email sent to ${email}`)
  return res.send(msg)
}

export async function resetPasswordHandler (
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: Response): Promise<Response> {
  const { id, passwordResetCode } = req.params
  const { password } = req.body
  const user = await findUserById(id)
  if (
    user == null ||
    user.passwordResetCode == null ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send('Could not reset user password')
  }
  user.passwordResetCode = null
  user.password = password
  await user.save()
  return res.send('Successfully updated user password')
}

export async function getCurrentUserHandler (
  _req: Request,
  res: Response
): Promise<Response> {
  return res.send(res.locals.user)
}
