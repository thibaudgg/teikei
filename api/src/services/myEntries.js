import Depot from '../models/depots'
import Farm from '../models/farms'
import Initiative from '../models/initiatives'
import wrapFeatureCollection from '../hooks/geoJson'
import { entryColumns } from './entries'

const filterOwnedEntries = (entries, userId) =>
  entries.filter(e => e.ownerships.some(o => o.id === userId)).map(o => {
    // eslint-disable-next-line no-param-reassign
    delete o.ownerships
    return o
  })

export default app => {
  const service = {
    async find(params) {
      const userId = params.user && params.user.id

      const farms = await Farm.query()
        .eager('ownerships')
        .select(entryColumns())
      const depots = await Depot.query()
        .eager('ownerships')
        .select(entryColumns())
      const initiatives = await Initiative.query()
        .eager('ownerships')
        .select(entryColumns())
      return filterOwnedEntries(
        farms.concat(depots).concat(initiatives),
        userId
      )
    }
  }

  app.use('/myentries', service)
  app.service('myentries').hooks({
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },

    after: {
      all: [],
      find: [wrapFeatureCollection],
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
