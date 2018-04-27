const KoaRouter = require('koa-router')
const methods = require('methods')
const debug = require('debug')('joi')
const Joi = require('joi')

const Finder = require('./apiFinder')
const SwaggerBuilder = require('./swaggerBuilder')

class Koapii extends KoaRouter {
  constructor() {
    super()
    this.routes = []
    this.validTarget = ['query', 'params', 'body']
    this.router = new KoaRouter()
    this.finder = new Finder()
  }
  /**
   * add multiple middleware to koa-router 
   * 
   * @param {any} spec 
   * @memberof Koapii
   */
  _createRoute(spec) {
    const { method, path, handler, validate } = spec
    const route = this.router
    const validator = this.validator(validate)
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
      throw new Error('method is undefined')
    }
    route[method].call(route, path, ...middlewares)
  }
  /**
   * cp all params on route obj
   * 
   * @returns 
   * @memberof Koapii
   */
  _mountRequest() {
    const route = this.route
    return function (ctx, next) {
      route.request = {}
      route.request.query = ctx.query
      route.request.params = ctx.params
      route.request.body = ctx.request.body
      next()
    }
  }
  register(routeList) {
    if (!routeList) {
      routeList = this._scanRoutesDIR()
    }
    for (let i = 0; i < routeList.length; i++) {
      const spec = routeList[i]
      this.routes.push(spec)
      this._createRoute(spec)
    }
    return this
  }
  _scanRoutesDIR () {
    const routeList = this.finder.routes()
    return routeList
  }
  buildSwagger(spec) {
    const fileList = this.finder.fileName()
    const routeList = this.finder.routes()
    const swagger = new SwaggerBuilder({
      fileList,
      routeList
    })
  }
  validator(validate) {
    const validTarget = this.validTarget
    const route = this.route
    return function (ctx, next) {
      validTarget.forEach(t => {
        const targets = validate[t]
        const data = route.request[t]
        if (targets) {
          const schema = Joi.object().keys({ ...targets })
          Joi.validate(data, targets, (err, value) => {
            if (err) {
              ctx.status = 400
              ctx.body = err
            } else {
              next()
            }
          })
        }
      })
    }
  }
  load() {
    return this.router.routes()
  }
  allowedMethods() {
    return this.router.allowedMethods()
  }
}

module.exports = Koapii