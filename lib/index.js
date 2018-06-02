const KoaRouter = require('koa-router')
const debug = require('debug')('swapi')
const Joi = require('joi')

const Finder = require('./apiFinder')
const swaggerServer = require('./swaggerServer')

const ValidType = ['query', 'params', 'body']

class Swapi extends KoaRouter {
  constructor () {
    super()
    this.routes = []
    this.router = new KoaRouter()
    this.finder = new Finder()
  }

  /**
   * Main func, step 1: build koa router; step 2: build swagger documant
   *
   * @param {any} app
   * @param {any} customOption
   * @returns
   * @memberof Swapi
   */
  async register (app, customOption) {
    const routeFiles = this.finder.findRouteFiles()

    this.app = app
    this.customOption = customOption
    this._buildKoaRoutes()
    this._buildSwagger()
    return this
  }

  /**
   * Duplicate all params on route obj
   *
   * @returns
   * @memberof Swapi
   */
  _mountRequest () {
    const route = this.route
    return async (ctx, next) => {
      route.request = {}
      route.request.query = ctx.query
      route.request.params = ctx.params
      route.request.body = ctx.request.body
      await next()
    }
  }

  /**
   * step 1: build koa router
   */
  _buildKoaRoutes () {
    const routeList = this.finder.combineRoutes()

    for (let i = 0; i < routeList.length; i++) {
      const spec = routeList[i]

      // this.routes.push(spec)
      this._createRoute(spec)
    }
    this._useRoute()
  }

  /**
   * add multiple middleware to koa-router, build koa router
   *
   * @param {any} spec
   * @memberof Swapi
   */
  _createRoute (spec) {
    const { method, path, validate, id, handler } = spec
    const { basePath } = this.customOption
    const route = this.router
    const validator = this._validator(validate)
    const mountRequest = this._mountRequest()

    const middlewares = [
      mountRequest,
      validator,
      handler
    ]
    
    if (!method) {
      throw new Error('method is undefined')
    }
    if (!path) {
      throw new Error('path is undefined')
    }
    if (!handler) {
      throw new Error('handler is undefined')
    }
    const fullPath = `${basePath || ''}${path}`
    debug(fullPath)
    route[method](fullPath, ...middlewares)
  }

  /**
   * middleware bedore handler
   */
  _validator (validate) {
    const route = this.route

    return async (ctx, next) => {
      for (let i = 0; i < ValidType.length; i++) {
        const type = ValidType[i]
        const targets = validate[type]
        const data = route.request[type]
        if (targets) {
          const schema = Joi.object().keys(targets)
          const { error } = Joi.validate(data, schema)
          if (error) {
            ctx.throw(400, 'ValidationError', error)
          }
        }
      }
      await next()
    }
  }

  /**
   * call swagger builder
   */
  _buildSwagger () {
    const fileList = this.finder.findRouteFiles()

    swaggerServer.start({
      app: this.app,
      fileList,
      customOption: this.customOption
    })
  }

  load () {
    return this.router.routes()
  }

  allowedMethods () {
    return this.router.allowedMethods()
  }

  _useRoute () {
    const routes = this.load()
    const allowedMethods = this.allowedMethods()
    this.app.use(routes, allowedMethods)
  }
}

module.exports = Swapi
