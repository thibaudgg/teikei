import { disallow } from 'feathers-hooks-common'
import Email from 'email-templates'
import path from 'path'
import inky from 'inky'
import nunjucks from 'nunjucks'
import nodemailer from 'nodemailer'
import postmarkTransport from 'nodemailer-postmark-transport'
import glob from 'glob'
import filterAllowedFields from '../hooks/filterAllowedFields'
import fs from 'fs'

export const sourceTemplateRoot = path.resolve(
  __dirname,
  '..',
  '..',
  'src',
  'templates'
)

const compiledTemplateRoot = path.resolve(
  __dirname,
  '..',
  '..',
  'build',
  'templates'
)

const compileTemplates = (app) => {
  glob.sync(path.resolve(sourceTemplateRoot, '**/*.njk')).forEach((file) => {
    const dirname = path.dirname(file)
    inky({
      src: path.resolve(dirname, '*.njk'),
      dest: path.resolve(
        compiledTemplateRoot,
        path.relative(sourceTemplateRoot, dirname)
      ),
    })
  })
  app.info('Email templates compiled successfully.')
}

export default (app) => {
  const mailerConfig = app.get('mailer')

  const options = {
    ...mailerConfig.nodemailerOptions,
    views: {
      root: compiledTemplateRoot,
      options: {
        extension: 'njk',
      },
    },
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: sourceTemplateRoot,
      },
    },
  }

  if (app.isProduction() && mailerConfig.transport === 'postmarkTransport') {
    app.info(
      'activating Postmark mailer - PRODUCTION MODE. Emails will be delivered to recipients.'
    )
    options.transport = nodemailer.createTransport(
      postmarkTransport(mailerConfig.postmarkTransport)
    )
  } else if (
    app.isProduction() &&
    mailerConfig.transport === 'postmarkSandboxTransport'
  ) {
    app.info(
      'activating Postmark mailer - SANDBOX MODE. Emails will be delivered to Postmark Sandbox.'
    )
    options.transport = nodemailer.createTransport(
      postmarkTransport(mailerConfig.postmarkSandboxTransport)
    )
  } else {
    app.info(
      'activating Ethereal mailer - TEST MODE. Emails will not be delivered to recipients.'
    )
    options.transport = nodemailer.createTransport(
      mailerConfig.etherealTransport
    )
  }

  const email = new Email(options)

  const service = {
    create: async (data, params) => {
      const template = `emails/${data.template}`
      if (!email.templateExists(`${template}/html`)) {
        throw new Error(`missing html template for ${data.template}`)
      }
      if (params.render) {
        const templateMeta = JSON.parse(
          fs.readFileSync(
            path.resolve(sourceTemplateRoot, template, 'metadata.json'),
            options
          )
        )
        return email.render(`${template}/html`, {
          ...templateMeta.testData,
          ...data.locals,
        })
      }
      return email.send({ ...data, template })
    },
    setup: async (a) => {
      compileTemplates(a)
      nunjucks.configure(compiledTemplateRoot, {})
    },
  }

  app.use('/emails', service)

  app
    .service('emails')
    .hooks({
      before: {
        all: [disallow('external')],
        create: [],
      },
      after: {
        all: [],
        create: [],
      },
      error: {
        all: [],
        create: [],
      },
    })
    .hooks({
      after: {
        all: [filterAllowedFields],
      },
    })
}
