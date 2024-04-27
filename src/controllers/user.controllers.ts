import { Request, Response } from 'express'

import log from 'src/utils/logger'
import sendEmail from 'src/utils/mailer'
import { CreateUserInput, ForgotPasswordInput, VerifyUserInput, ResetPasswordInput } from 'src/schemas/user.schemas'
import { createUser, findUserById, findUserByEmail } from 'src/services/user.services'
import { nanoid } from 'nanoid'
import UserModel from 'src/models/user.models'
import mongoose from 'mongoose'

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

export async function getTop3UsersHandler (
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const users = await UserModel.aggregate([
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
            foreignField: 'receiver',
            as: 'pr'
          }
      },
      {
        $addFields:
          {
            payReceiveds: {
              $size: '$pr'
            }
          }
      },
      {
        $sort:

          {
            payReceiveds: -1
          }
      },
      {
        $limit:

          3
      },
      {
        $project:
          {
            pr: 0,
            idToString: 0
          }
      }
    ])
    return res.send(users)
  } catch (error) {
    log.error(error)
    return res.status(500).send()
  }
}

export async function getNegativeMoneyUsers (
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const users = await UserModel.aggregate([
      {
        $match:
          {
            $expr: {
              $gt: ['$deubt', '$benefit']
            }
          }
      },
      {
        $project:
          {
            firstName: 1,
            lastName: 1,
            totalMoney: {
              $subtract: ['$benefit', '$deubt']
            }
          }
      },
      { $sort: { totalMoney: 1 } }
    ])
    const collections = await mongoose.connection.db.listCollections().toArray()
    const collectionExists = collections.some(collection => collection.name === 'negativeMoneyUsers')
    if (!collectionExists) {
      await mongoose.connection.db.createCollection('negativeMoneyUsers')
      await mongoose.connection.db.collection('negativeMoneyUsers').insertMany(users)
    } else {
      await mongoose.connection.db.collection('negativeMoneyUsers').deleteMany({})
      await mongoose.connection.db.collection('negativeMoneyUsers').insertMany(users)
    }
    return res.send(users)
  } catch (error) {
    log.error(error)
    return res.status(500).send()
  }
}

export async function getPositiveMoneyUsers (
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const users = await UserModel.aggregate([
      {
        $match:
          {
            $expr: {
              $gt: ['$benefit', '$deubt']
            }
          }
      },
      {
        $project:
          {
            firstName: 1,
            lastName: 1,
            totalMoney: {
              $subtract: ['$benefit', '$deubt']
            }
          }
      },
      { $sort: { totalMoney: -1 } }
    ])
    const collections = await mongoose.connection.db.listCollections().toArray()
    const collectionExists = collections.some(collection => collection.name === 'positiveMoneyUsers')
    if (!collectionExists) {
      await mongoose.connection.db.createCollection('positiveMoneyUsers')
      await mongoose.connection.db.collection('positiveMoneyUsers').insertMany(users)
    } else {
      await mongoose.connection.db.collection('positiveMoneyUsers').deleteMany({})
      await mongoose.connection.db.collection('positiveMoneyUsers').insertMany(users)
    }
    return res.send(users)
  } catch (error) {
    log.error(error)
    return res.status(500).send()
  }
}

export async function getAverageCosts (
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const users = await UserModel.aggregate([
      {
        $addFields:
          {
            idString: {
              $toString: '$_id'
            }
          }
      },
      {
        $lookup:
          {
            from: 'payments',
            localField: 'idString',
            foreignField: 'payer',
            as: 'payments'
          }
      },
      {
        $unwind:
          {
            path: '$payments',
            preserveNullAndEmptyArrays: false
          }
      },
      {
        $addFields:
          {
            groupIdObject: {
              $toObjectId: '$payments.group'
            }
          }
      },
      {
        $lookup:
          {
            from: 'groups',
            localField: 'groupIdObject',
            foreignField: '_id',
            as: 'group'
          }
      },
      {
        $unwind:
          {
            path: '$group',
            preserveNullAndEmptyArrays: false
          }
      },
      {
        $group:
          {
            _id: {
              userId: '$firstName',
              groupName: '$group.name'
            },
            totalSpent: {
              $sum: '$payments.amount'
            },
            averageReceived: {
              $avg: {
                $multiply: [-1, '$payments.amount']
              }
            }
          }
      },
      {
        $project: {
          _id: '$_id.userId',
          group: '$_id.groupName',
          totalSpent: 1,
          averageReceived: 1
        }
      }
    ])
    return res.send(users)
  } catch (error) {
    log.error(error)
    return res.status(500).send()
  }
}
