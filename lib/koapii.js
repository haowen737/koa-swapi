const KoaRouter = require('koa-router')
const methods = require('methods')
const debug = require('debug')('joi')
const Joi = require('joi')

class Koapi extends KoaRouter {
  constructor() {
    super()
    this.routes = []
    this.validTarget = ['query', 'params', 'body']
    this.router = new KoaRouter()
  }
  /**
   * add multiple middleware to koa-router 
   * 
   * @param {any} spec 
   * @memberof Koapi
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
    route[method].call(route, path, ...middlewares)
  }
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
  register(spec) {
    for (let i = 0; i < spec.length; i++) {
      const ele = spec[i]
      this.routes.push(ele)
      this._createRoute(ele)
    }
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
  loadApi() {
    return this.router.routes()
  }
  loadAllowedMethods() {
    return this.router.allowedMethods()
  }
}

module.exports = Koapi