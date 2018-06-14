import createService from 'feathers-objection/lib/index'
import { hooks as authHooks } from '@feathersjs/authentication/lib/index'

import Farm from '../../app/models/farms'
import { featureCollection } from '../../app/util/jsonUtils'
import { restrictToUser, restrictToOwner } from '../../auth/hooks/authorization'
import { connectOwner, connectProducts } from '../hooks/relations'
import { setCreatedAt, setUpdatedAt } from '../hooks/audit'

export default app => {
  const service = createService({
    model: Farm,
    allowedEager: ['roles', 'places', 'products']
  })

  const withEager = builder =>
    builder
      .eager('[places, products]')
      .modifyEager('products', b => b.select(['category', 'name']))

  service.find = async () => featureCollection(await withEager(Farm.query()))
  service.get = async id => withEager(Farm.query().findById(id))

  service.getWithOwnerships = async id =>
    Farm.query()
      .findById(id)
      .eager('ownerships')

  app.use('/depots', service)

  app.use('/farms', service)
  app.service('farms').hooks({
    before: {
      create: [authHooks.authenticate('jwt'), restrictToUser, setCreatedAt],
      update: [authHooks.authenticate('jwt'), restrictToOwner, setUpdatedAt],
      patch: [authHooks.authenticate('jwt'), restrictToOwner, setUpdatedAt],
      remove: [authHooks.authenticate('jwt'), restrictToOwner]
    },
    after: {
      create: [connectProducts, connectOwner],
      patch: [connectProducts]
    }
  })
}