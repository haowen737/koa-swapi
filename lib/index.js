const KoaRouter = require('koa-router')
const debug = require('debug')('swapi')
const Joi = require('joi')

const Finder = require('./apiFinder')
const swaggerBuilder = require('./swaggerBuilder')

class Swapi extends KoaRouter {
  constructor () {
    super()
    this.routes = []
    this.validType = ['query', 'params', 'body']
    this.router = new KoaRouter()
    this.finder = new Finder()
  }
  /**
   * Main func
   *
   * @param {any} app
   * @param {any} customOption
   * @returns
   * @memberof Swapi
   */
  async register (app, customOption) {
    this.app = app
    this._buildKoaRoutes()
    await this._buildSwagger(customOption)
    return this
  }
  /**
   * add multiple middleware to koa-router, build koa router
   *
   * @param {any} spec
   * @memberof Swapi
   */
  _createRoute (spec) {
    const { method, path, handler, validate } = spec
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
    route[method](path, ...middlewares)
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
  _buildKoaRoutes () {
    const routeList = this._scanRoutesDIR()

    for (let i = 0; i < routeList.length; i++) {
      const spec = routeList[i]
      this.routes.push(spec)
      this._createRoute(spec)
      debug('register', spec.path)
    }
    this._useRoute()
  }
  _scanRoutesDIR () {
    const routeList = this.finder.routes()
    return routeList
  }
  // TODO: 路由参数只验证了一种，通过就next了，这是有问题的
  _validator (validate) {
    const validType = this.validType
    const route = this.route
    return async (ctx, next) => {
      for (let i = 0; i < validType.length; i++) {
        const type = validType[i]
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
  async _buildSwagger (customOption) {
    const fileList = this.finder.fileName()
    await swaggerBuilder.build({
      app: this.app,
      fileList,
      customOption
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
