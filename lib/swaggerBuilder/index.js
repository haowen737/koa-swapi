const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const yaml = require('js-yaml')
const debug = require('debug')('swagger-builder')


const yamlBuilder = require('./yamlBuilder')
const pathMelter = require('./pathMelter')
const swaggerServer = require('./swaggerServer')
// const Swagger = require('swagger-client')

const printf = console.log
const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_DOC = path.resolve(PATH_APP, './docs')

const swaggerBuilder = module.exports = {}
const internals = {}

swaggerBuilder.build = function({
  app,
  fileList,
  customOption
}) {
  const _paths = {}
  const _tags = []
  let descriptor = {}
  
  if (!fs.existsSync(PATH_ROUTE)) {
    fs.mkdirSync(PATH_ROUTE);
  }
  for (let i = 0; i < fileList.length; i++) {
    const dir = fileList[i]
    const routeDir = internals._parseRoute(dir)
    const yamlDIr = internals._yamlFilePath(dir)
    const specList = require(routeDir)
    // const { paths, tags } = yamlBuilder.buildSpec(specList)
    const paths = pathMelter.build(specList)
    console.log('path--->', paths)
    Object.assign(_paths, ...paths)
    // _tags.push(...tags)

    // const yml = yaml.safeDump(paths)
    // fs.writeFileSync(yamlDIr, yml)
    // debug(dir, ' -> yaml created sucessfully')
  }
  descriptor = Object.assign({}, {
    ...this.customOpts,
    tags: _tags,
    paths: _paths
  })
  console.log('descriptor', descriptor)
  const swagger = yamlBuilder.build(descriptor)
  const server = swaggerServer(swagger)
  app.use(server)
}

internals._apiFilePath = function(dir) {
  return path.resolve(PATH_DOC, dir)
}

internals._yamlFilePath = function(dir) {
  const theDir = dir.replace('.js', '.yaml')
  return path.resolve(PATH_DOC, theDir)
}

internals._parseRoute = function(dir) {
  return path.resolve(PATH_ROUTE, dir)
}
