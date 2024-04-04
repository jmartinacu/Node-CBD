import { array, object, string, TypeOf } from 'zod'

export const createGroupSchema = object({
  body: object({
    name: string({
      required_error: 'Group name is required'
    }),
    users: array(string(), {
      required_error: 'A group cannot be empty'
    }).min(1, 'A group must have at least one member')
  })
})

export type CreateGroupInput = TypeOf<typeof createGroupSchema>['body']
