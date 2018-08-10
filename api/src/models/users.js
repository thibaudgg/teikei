import schema from '@teikei/schemas'

import { BaseModel } from './base'

export default class User extends BaseModel {
  static tableName = 'users'

  static jsonSchema = schema.user

  static relationMappings = {
    roles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: `${__dirname}/roles`,
      join: {
        from: 'users.id',
        through: {
          from: 'users_roles.user_id',
          to: 'users_roles.role_id'
        },
        to: 'roles.id'
      }
    }
  }
}