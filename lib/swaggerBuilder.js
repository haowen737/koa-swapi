const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const yaml = require('js-yaml')
const debug = require('debug')('swagger-builder')


const yamlBuilder = require('./yamlBuilder')
const swaggerServer = require('./swaggerServer')
const defaultSettings = require('./defaults')

// const Swagger = require('swagger-client')

const printf = console.log
const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_DOC = path.resolve(PATH_APP, './docs')

// const swagger = new SwaggerClient(specUrl)
class SwaggerBuilder {
  constructor({
    app,
    fileList,
    customOption
  }) {
    this.app = app
    this.descriptor = {}
    this.customOpts = customOption
    this.fileList = fileList
    this.build()
  }

  build() {
    const fileList = this.fileList
    const _paths = []
    const _tags = []
    if (!fs.existsSync(PATH_ROUTE)) {
      fs.mkdirSync(PATH_ROUTE);
    }
    for (let i = 0; i < fileList.length; i++) {
      const dir = fileList[i]
      const routeDir = this._parseRoute(dir)
      const yamlDIr = this._yamlFilePath(dir)
      const specList = require(routeDir)
      const { paths, tags } = yamlBuilder.buildSpec(specList)

      _paths.push(...paths)
      _tags.push(...tags)

      // const yml = yaml.safeDump(apis)
      // fs.writeFileSync(yamlDIr, yml)
      debug(dir, ' -> yaml created sucessfully')
    }
    this.descriptor = Object.assign({}, {
      ...this.customOpts,
      tags: _tags,
      paths: _paths
    })
    console.log('descriptor', this.descriptor)
    this._startSwaggerServer()
  }

  _apiFilePath (dir) {
    return path.resolve(PATH_DOC, dir)
  }

  _yamlFilePath(dir) {
    const theDir = dir.replace('.js', '.yaml')
    return path.resolve(PATH_DOC, theDir)
  }

  _parseRoute(dir) {
    return path.resolve(PATH_ROUTE, dir)
  }

  _startSwaggerServer() {
    const swagger = yamlBuilder.build(this.descriptor)
    const server = swaggerServer(swagger)
    this.app.use(server)
  }

}



module.exports = SwaggerBuilder