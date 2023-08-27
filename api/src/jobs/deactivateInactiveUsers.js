import BaseModel from '../models/base'

const deactivateEntries = async () => {
  await BaseModel.knex().raw(`
    update farms f set active = false where f.id IN
    (select fa.farm_id from farms_users fa, users u
    where u.id = fa.user_id
    and u.state = 'ACTIVE_REMINDER_SENT'
    and u.reminder_sent_at <= current_date - interval '2 months')
  `)

  await BaseModel.knex().raw(`
    update initiatives i set active = false where i.id IN
    (select ia.initiative_id from initiatives_users ia, users u
    where u.id = ia.user_id
    and u.state = 'ACTIVE_REMINDER_SENT'
    and u.reminder_sent_at <= current_date - interval '2 months')
  `)

  await BaseModel.knex().raw(`
    update depots d set active = false where d.id IN
    (select fd.depot_id from farms_users fa, users u, farms_depots fd
    where u.id = fa.user_id
    and fd.farm_id = fa.farm_id
    and u.state = 'ACTIVE_REMINDER_SENT'
    and u.reminder_sent_at <= current_date - interval '2 months')
  `)
}

const deactivateUsers = async () => {
  await BaseModel.knex().raw(
    `update users
       set state = 'INACTIVE_NO_RESPONSE'
       where state = 'ACTIVE_REMINDER_SENT'
       and reminder_sent_at <= current_date - interval '2 months'`
  )
}

const JOB_NAME = 'deactivate inactive users'
const SCHEDULE_EVERY_QUARTER = '0 5 1 2,5,8,11 *'

export default (app) => {
  app.jobs.schedule(5, JOB_NAME, SCHEDULE_EVERY_QUARTER, async () => {
    app.info(`CRON: ${JOB_NAME} - starting`)

    app.info('deactivating entries')
    await deactivateEntries()
    app.info('deactivating users')
    await deactivateUsers()

    app.info(`CRON: ${JOB_NAME} - done`)
  })
}
