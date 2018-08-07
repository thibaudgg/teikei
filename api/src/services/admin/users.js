import createService from 'feathers-objection/lib/index'
import { hooks as authHooks } from '@feathersjs/authentication'

import User from '../../app/models/admin/users'
import { addFilteredTotal } from '../../hooks/admin'
import { restrictToSuperAdmin } from '../../hooks/authorization'
import { setCreatedAt, setUpdatedAt } from '../../hooks/audit'

export default app => {
  const service = createService({
    model: User,
    paginate: {
      default: 50,
      max: 100
    }
  })

  app.use('/admin/users', service)
  app.service('/admin/users').hooks({
    before: {
      all: [authHooks.authenticate('jwt'), restrictToSuperAdmin],
      find: [],
      get: [],
      create: [setCreatedAt],
      update: [setUpdatedAt],
      patch: [setUpdatedAt],
      remove: []
    },
    after: {
      all: [],
      find: [addFilteredTotal],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },
    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  })
}
