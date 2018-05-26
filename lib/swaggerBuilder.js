const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const debug = require('debug')('swagger-builder')

const swaggerServer = require('./swaggerServer')
const Paths = require('./swagger/paths')
const Info = require('./swagger/info')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_DOC = path.resolve(PATH_APP, './docs')
const settings = require('./defaults')

const pathMelter = new Paths(settings)

const swaggerBuilder = module.exports = {}
const internals = {}

swaggerBuilder.build = function ({
  app,
  fileList,
  customOption
}) {
  let _paths = {}
  let descriptor = {}

  if (!fs.existsSync(PATH_ROUTE)) {
    fs.mkdirSync(PATH_ROUTE)
  }
  for (let i = 0; i < fileList.length; i++) {
    const dir = fileList[i]
    const routeDir = internals._parseRoute(dir)
    const specList = require(routeDir)
    const pathData = pathMelter.build(specList)

    _paths = Object.assign(_paths, pathData)
  }
  const info = Info.build(customOption)
  descriptor = Object.assign({}, {
    info,
    paths: _paths
  })
  const server = swaggerServer(descriptor)
  app.use(server)
  chalk.blue('document build succeed')
  debug('document build succeed')
}

internals._apiFilePath = function (dir) {
  return path.resolve(PATH_DOC, dir)
}

internals._yamlFilePath = function (dir) {
  const theDir = dir.replace('.js', '.yaml')
  return path.resolve(PATH_DOC, theDir)
}

internals._parseRoute = function (dir) {
  return path.resolve(PATH_ROUTE, dir)
}
