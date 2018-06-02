const fs = require('fs')
const path = require('path')
const debug = require('debug')('swagger-builder')

const swaggerServer = require('./swaggerServer')
const Builder = require('./swagger/builder')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const defaults = require('./defaults')

const swaggerBuilder = module.exports = {}
const internals = {}

swaggerBuilder.build = async function (fileList, customOption, ctx) {
  const apis = []

  if (!fs.existsSync(PATH_ROUTE)) {
    fs.mkdirSync(PATH_ROUTE)
  }
  debug('fileList', fileList)

  for (let i = 0; i < fileList.length; i++) {
    const dir = fileList[i]
    const routeDir = internals.parseRoute(dir)

    debug(routeDir)

    const specList = require(routeDir)
    apis.push(...specList)
  }

  const settings = Object.assign(defaults, customOption)

  return await Builder.getSwaggerJSON(settings, apis, ctx)
}

/**
 * return each route path
 */
internals.parseRoute = function (dir) {
  return path.resolve(PATH_ROUTE, dir)
}
