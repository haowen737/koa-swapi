const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const chalk = require('chalk')
const debug = require('debug')('swagger:server')
const SwaggerUI = require('../public/swagger-ui-dist')

const setting = require('./defaults')

const swaggerServer = new Koa()
const printf = console.log

const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath()

// const getSwaggerJSON = async (ctx, next) => {
//   ctx.body = JSON.stringify(swaggerOpts)
// }

const serveSwagger = (swaggerJSON) => {
  swaggerServer.use(async (ctx, next) => {
    if (ctx.path === setting.documentationPath) { // koa static barfs on root url w/o trailing slash
      ctx.redirect(ctx.path + '/')
    } else {
      await next()
    }
  })

  swaggerServer.use(mount(setting.documentationPath, serve(swaggerUiAssetPath)))
  debug('documentationPath', setting.documentationPath)
  printf('document build succeed, path', chalk.blue(setting.documentationPath))

  swaggerServer.use(mount(setting.jsonPath, async (ctx, next) => {
    ctx.body = JSON.stringify(swaggerJSON)
  }))

  debug(setting.jsonPath)
}

module.exports = function server (desc) {
  serveSwagger(desc)

  return mount(swaggerServer, '/')
}
