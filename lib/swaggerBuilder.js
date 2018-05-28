const fs = require('fs')
const path = require('path')
const debug = require('debug')('swagger-builder')

const swaggerServer = require('./swaggerServer')
const Builder = require('./swagger/builder')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const settings = require('./defaults')

const swaggerBuilder = module.exports = {}
const internals = {}

swaggerBuilder.build = async function ({
  app,
  fileList,
  customOption
}) {
  const apis = []

  if (!fs.existsSync(PATH_ROUTE)) {
    fs.mkdirSync(PATH_ROUTE)
  }

  for (let i = 0; i < fileList.length; i++) {
    const dir = fileList[i]
    const routeDir = internals._parseRoute(dir)

    debug(routeDir)

    const specList = require(routeDir)
    apis.push(...specList)
  }

  const descriptor = await Builder.getSwaggerJSON(settings, apis)

  const server = swaggerServer(descriptor)

  app.use(server)
}

internals._parseRoute = function (dir) {
  return path.resolve(PATH_ROUTE, dir)
}
