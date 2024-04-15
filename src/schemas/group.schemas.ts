import { array, object, string, optional, TypeOf } from 'zod'

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

export const getGroupByIdSchema = object({
  params: object({
    id: string({ required_error: 'User id is mandatory' })
  })
})

export const updateGroupSchema = object({
  body: object({
    name: optional(string()),
    users: optional(array(string()))
  })
})

export type CreateGroupInput = TypeOf<typeof createGroupSchema>['body']
export type GetGroupByIdInput = TypeOf<typeof getGroupByIdSchema>['params']
export type UpdateGroupInput = TypeOf<typeof updateGroupSchema>['body']
