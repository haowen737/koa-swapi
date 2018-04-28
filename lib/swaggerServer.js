const Koa = require('koa')
const serve = require('koa-static')
const fs = require('fs')
const path = require('path')
const http = require('http')
const mount = require('koa-mount')
const chalk = require('chalk')
const debug = require('debug')('swagger-server')
const SwaggerUI = require('./swagger-ui-dist')
const { cloneDeep } = require('lodash')

const defaultOpts = require('./swaggerDefaultOpts')

const { SwaggerUIBundle } = SwaggerUI
const swaggerServer = new Koa()
const printf = console.log
const PORT = 3336
const PATH_APP = process.cwd()
const PATH_DOC = path.resolve(PATH_APP, './docs')

const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath()

module.exports = function server(desc) {
  const descriptor = cloneDeep(desc)
  const json = Object.assign({}, defaultOpts, desc)
  console.log(json)
  swaggerServer.use(mount('/', serve(swaggerUiAssetPath)))
  swaggerServer.use(mount(defaultOpts.swaggerURL, serve(swaggerUiAssetPath)))
  swaggerServer.use(mount(defaultOpts.swaggerJSON, async (ctx, next) => {
    ctx.body = JSON.stringify(json)
  }))

  return mount(swaggerServer, '/')
}


// module.exports = function server (app) {
//   const ui = SwaggerUIBundle({
//     dom_id: '#swagger-ui',
//     presets: [
//       SwaggerUIBundle.presets.apis,
//       SwaggerUIBundle.SwaggerUIStandalonePreset
//     ],
//     layout: "StandaloneLayout"
//   })

//   swaggerServer.use(require('koa-static')(swaggerUiAssetPath))
//   swaggerServer.listen(3332)
// }
