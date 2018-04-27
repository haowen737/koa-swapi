const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const http = require('http')
const chalk = require('chalk')
const yaml = require('js-yaml')
const Joi = require('joi')
const j2s = require('joi-to-swagger')

const { cloneDeep } = require('lodash')

// const Swagger = require('swagger-client')

const app = new Koa()
const printf = console.log
const PORT = 30002
const PATH_APP = process.cwd()
const PATH_DOC = path.resolve(PATH_APP, './docs')
const validTarget = ['query', 'params', 'body']

// const swagger = new SwaggerClient(specUrl)
class SwaggerBuilder {
  constructor({
    fileList,
  }) {
    this.fileList = fileList
    this.build()
  }

  build() {
    if (!fs.existsSync(PATH_DOC)) {
      fs.mkdirSync(PATH_DOC);
    }
    this.fileList.forEach(dir => {
      const routeDir = this._parseRoute(dir)
      const yamlDIr = this._yamlFilePath(dir)
      const specList = require(routeDir)
      // this._handleSpec(specList)
      const _spec = this._parseSpec(specList)
      const yml = yaml.safeDump(_spec)

      fs.writeFile(yamlDIr, yml, (err) => {
        if (err) throw err
        console.log('yaml was successfully created')
      })
    })
  }
  
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

}

// const server = http.createServer(app.callback())

// const onListening = () => {
//   printf(chalk.green(`swagger is listening on port ${chalk.blue(PORT)}`))
//   // debug(`server is listening on port ${PORT}, started at ${config.env} mode`)
// }

// server.listen(PORT)
// server.on('listening', onListening)

module.exports = SwaggerBuilder