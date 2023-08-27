import schedule from 'node-schedule'

import refreshSearchIndex from './refreshSearchIndex'
import reverseGeocode from './reverseGeocode'
import sendAuditEmail from './sendAuditEmail'
import sendEmailCampaignMessages from './sendEmailCampaignMessages'
import createLoginReminders from './createLoginReminders'
import deactivateInactiveUsers from './deactivateInactiveUsers'

export default (app) => {
  app.jobs = []
  app.jobs.schedule = (id, name, cron, callback) => {
    const job = schedule.scheduleJob(name, cron, callback)
    app.info(`registering job ${name}`)
    app.jobs[id] = { id, cron, job }
  }

  app.configure(refreshSearchIndex)
  app.configure(reverseGeocode)
  app.configure(sendAuditEmail)
  app.configure(createLoginReminders)
  app.configure(deactivateInactiveUsers)
  app.configure(sendEmailCampaignMessages)
}
