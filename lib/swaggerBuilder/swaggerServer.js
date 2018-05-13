const Koa = require('koa')
const serve = require('koa-static')
const fs = require('fs')
const path = require('path')
const http = require('http')
const mount = require('koa-mount')
const chalk = require('chalk')
const debug = require('debug')('swagger-server')
const SwaggerUI = require('../swagger-ui-dist')
const { cloneDeep } = require('lodash')

const setting = require('../defaults')

const { SwaggerUIBundle } = SwaggerUI
const swaggerServer = new Koa()
const printf = console.log
const PORT = 3336
const PATH_APP = process.cwd()
const PATH_DOC = path.resolve(PATH_APP, './docs')

const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath()

const getSwaggerJSON = async (ctx, next) => {
  ctx.body = JSON.stringify(swaggerOpts)
}

const serveSwagger = (swaggerJSON) => {
  // console.log('swaggerJSON', swaggerJSON)

  swaggerServer.use(async (ctx, next) => {
    if (ctx.path === setting.documentationPath) { // koa static barfs on root url w/o trailing slash
      ctx.redirect(ctx.path + '/')
    } else {
      await next()
    }
  })

  swaggerServer.use(mount(setting.documentationPath, serve(swaggerUiAssetPath)))
  
  swaggerServer.use(mount(setting.jsonPath, async = (ctx, next) => {
    ctx.body = JSON.stringify(swaggerJSON)
    // ctx.body = require('./fakeJSON')
  }))

}

module.exports = function server(desc) {
  serveSwagger(desc)

  return mount(swaggerServer, '/')
}