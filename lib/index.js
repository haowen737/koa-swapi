const Hoek = require('hoek')
const KoaRouter = require('koa-router')
const debug = require('debug')('swapi')

const Finder = require('./apiFinder')
const swaggerServer = require('./swaggerServer')
const validator = require('./validator')

class Swapi extends KoaRouter {
  constructor () {
    super()
    this.routes = []
    this.router = new KoaRouter()
  }

  /**
   * Main func, step 1: build koa router; step 2: build swagger documant;
   * options include custom settings and routes(for version 1.0)
   * @param {any} app
   * @param {any} options
   * @returns
   * @memberof Swapi
   */
  async register (app, options) {
    this.finder = new Finder({ routes: options.routes })
    this.app = app
    this.options = options
    this._buildKoaRoutes()
    this._buildSwagger()

    return this
  }

  /**
   * step 1: build koa router;
   * routes can be passed from params or use api finder find;
   * api finder will automatically find /routes and /controllers;
   */
  _buildKoaRoutes () {
    const routes = this.options.routes
    const routeList = routes
      ? this.finder.combineControllers(routes)
      : this.finder.combineRoutes()

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
    const { basePath } = this.options
    const route = this.router

    const path = spec.path
    const method = spec.method
    const validate = Hoek.reach(spec, 'config.validate')
    const id = Hoek.reach(spec, 'config.id')
    const handler = Hoek.reach(spec, 'config.handler')
    // const mountRequestMiddleware = this._mountRequest()
    const validatorMiddleware = this._validator(validate)

    if (!method) {
      throw new Error('method is undefined')
    }
    if (!path) {
      throw new Error('path is undefined')
    }
    if (!handler) {
      throw new Error('handler is undefined')
    }

    const middlewares = [
      // mountRequestMiddleware,
      validatorMiddleware,
      handler
    ]

    const fullPath = `${basePath || ''}${path}`

    debug(fullPath)

    route[method](fullPath, ...middlewares)
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
   * middleware bedore handler
   */
  _validator (validate) {
    return async (ctx, next) => {
      validate && await validator.valid(validate, ctx)
      
      await next()
    }
  }

  /**
   * call swagger builder
   */
  _buildSwagger () {
    const { basePath } = this.options
    const fileList = this.finder.findRouteFiles()
    const customSetting = { basePath }

    swaggerServer.start({
      app: this.app,
      fileList,
      customSetting
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
