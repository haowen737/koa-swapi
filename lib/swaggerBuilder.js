const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const yaml = require('js-yaml')
const Joi = require('joi')
const j2s = require('joi-to-swagger')
const debug = require('debug')('swagger-builder')

const { cloneDeep } = require('lodash')

const swaggerServer = require('./swaggerServer')
const defaultSettings = require('./defaults')

// const Swagger = require('swagger-client')

const printf = console.log
const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_DOC = path.resolve(PATH_APP, './docs')
const validTarget = ['query', 'params', 'body']

// const swagger = new SwaggerClient(specUrl)
class SwaggerBuilder {
  constructor({
    app,
    fileList,
  }) {
    this.app = app
    this.descriptor = {}
    this.fileList = fileList
    this.build()
  }

  build() {
    const fileList = this.fileList
    this.descriptor.apis = []
    if (!fs.existsSync(PATH_ROUTE)) {
      fs.mkdirSync(PATH_ROUTE);
    }
    for (let i = 0; i < fileList.length; i++) {
      const dir = fileList[i]
      const routeDir = this._parseRoute(dir)
      const yamlDIr = this._yamlFilePath(dir)
      const specList = require(routeDir)
      const _spec = this._parseSpec(specList)
      const yml = yaml.safeDump(_spec)

      this.descriptor.apis.push(..._spec)

      fs.writeFileSync(yamlDIr, yml)
      debug(dir, ' -> yaml created sucessfully')
    }
    this._startSwaggerServer(this.descriptor)
  }
  // TODO: 字命名格式化成swagger所需格式
  _parseSpec(specList) {
    const parsedSpecList = []
    specList.forEach(spec => {
      const _spec = cloneDeep(spec)
      const { validate } = _spec
      const validateObj = this._parseJoi(validate)
      _spec.validate = validateObj

      delete _spec.handler

      parsedSpecList.push(_spec)
    })
    return parsedSpecList
  }

  _parseJoi(joiTarget) {
    const parsedTarget = {}
    validTarget.forEach(t => {
      const targets = joiTarget[t]
      if (targets) {
        const schema = Joi.object().keys({ ...targets })
        const { swagger } = j2s(schema)
        parsedTarget[t] = swagger
      }
    })
    return parsedTarget
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

  _startSwaggerServer(descriptor) {
    const server = swaggerServer(descriptor)
    this.app.use(server)
  }

}



module.exports = SwaggerBuilder