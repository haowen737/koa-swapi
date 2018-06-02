const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const chalk = require('chalk')
const debug = require('debug')('swagger:server')
const SwaggerUI = require('../public/swagger-ui-dist')

const swaggerBuilder = require('./swaggerBuilder')
const setting = require('./defaults')

const server = new Koa()
const printf = console.log

const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath()

const { documentationPath, jsonPath } = setting

const swaggerServer = module.exports = {}

swaggerServer.start = function({
  app,
  fileList,
  customOption
}) {

  server.use(async (ctx, next) => {
    if (ctx.path === documentationPath) { // koa static barfs on root url w/o trailing slash
      ctx.redirect(ctx.path + '/')
    } else {
      await next()
    }
  })

  server.use(mount(documentationPath, serve(swaggerUiAssetPath)))

  // printf('document build succeed, path', chalk.blue(documentationPath))

  server.use(mount(jsonPath, async (ctx, next) => {

    const swaggerJSON = await swaggerBuilder.build(fileList, customOption, ctx)

    ctx.body = JSON.stringify(swaggerJSON)
  }))

  app.use(mount(server))

}

// module.exports = function server (desc) {
//   serveSwagger(desc)

//   return mount(swaggerServer, '/')
// }
