import { disallow } from 'feathers-hooks-common'

import filterAllowedFields from '../../hooks/filterAllowedFields'
import { BadRequest } from '@feathersjs/errors'
import { reactivateUser } from '../../hooks/reactivateUser'

export default (app) => {
  const service = {
    create: async (params) => {
      const { id } = params
      if (id === undefined) {
        throw new BadRequest('id must be present for user reactivation.')
      }
      const { state } = await app.service('users').get(id)
      if (state !== 'ACTIVE') {
        await reactivateUser(app, id)
        return 'User reactivated.'
      } else {
        throw new BadRequest(
          'User is already active, no reactivation required.'
        )
      }
    },
  }
  app.use('/admin/user-reactivation', service)

  app
    .service('/admin/user-reactivation')
    .hooks({
      before: {
        all: [],
        find: [disallow()],
        get: [disallow()],
        create: [],
        update: [disallow()],
        patch: [disallow()],
        remove: [disallow()],
      },
      after: {
        all: [],
        find: [],
        get: [],
        create: [],
        patch: [],
        remove: [],
      },
      error: {
        all: [],
        find: [],
        get: [],
        create: [],
        patch: [],
        remove: [],
      },
    })
    .hooks({
      after: {
        all: [filterAllowedFields],
      },
    })
}