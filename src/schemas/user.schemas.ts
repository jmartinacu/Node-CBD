import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required'
    }),
    lastName: string({
      required_error: 'Last name is required'
    }),
    password: string({
      required_error: 'Password name is required'
    }).min(6, 'Password is too short - shoud be min 6 chars'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required'
    }),
    email: string({
      required_error: 'Email confirmation is required'
    }).email('Not a valid email')
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
})

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string()
  })
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Not a vlaid email')
  })
})

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string()
  }),
  body: object({
    password: string({
      required_error: 'Password name is required'
    }).min(6, 'Password is too short - shoud be min 6 chars'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required'
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
})

export const userAccessTokenPayload = object({
  _id: string(),
  firstName: string({
    required_error: 'First name is required'
  }),
  lastName: string({
    required_error: 'Last name is required'
  }),
  email: string({
    required_error: 'Email confirmation is required'
  }).email('Not a valid email')
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params']

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body']

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>

export type userAccessTokenPayloadInput = TypeOf<typeof userAccessTokenPayload>
