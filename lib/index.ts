// import * as Hoek from 'hoek'
import * as Hoek from 'hoek'
import * as KoaRouter from 'koa-router'
import * as Koa from 'koa'
import * as debug from 'debug'
import * as should from 'should'

import Finder from './apiFinder'
import swaggerServer from './swaggerServer'
import validator from './validator'

import { Route } from './intefaces/RouteConfig.interface'

interface Options {
  routes?: Array<Route>
  basePath?: string
}

/**
 * Expose Swapi class
 * Inherits from KoaRouter.prototype
 */
export class Swapi {
  private routes: Array<KoaRouter>
  private router: KoaRouter
  private finder: Finder
  private app: Koa
  private options: Options
  
  constructor () {
    this.routes = []
    this.router = new KoaRouter()
  }

  /**
   * Main func,
   *  step1: build koa router;
   *  step 2: build swagger documant;
   * options include custom settings and routes(for version 1.0)
   * @param {Server} app
   * @param {Object} options
   * @returns
   * @memberof Swapi
   */
  async register (app: Koa, options: Options = {}) {
    this.finder = new Finder({ routes: options.routes })
    this.app = app
    this.options = options
    this.buildKoaRoutes()
    this.buildSwagger()

    return this
  }

  /**
   * step 1: build koa router;
   * routes can be passed from params or use api finder find;
   * api finder will automatically find /routes and /controllers;
   */
  private buildKoaRoutes () {
    const routes = this.options.routes
    const routeList = routes
      ? this.finder.combineControllers(routes)
      : this.finder.combineRoutes()

    for (let i = 0; i < routeList.length; i++) {
      const spec: Route = routeList[i]

      // this.routes.push(spec)
      this.createRoute(spec)
    }
    this.useRoute()
  }

  /**
   * add multiple middleware to koa-router, build koa router
   *
   * @param {any} spec
   * @memberof Swapi
   */
  private createRoute (spec: Route) {
    const { basePath } = this.options
    const route = this.router
    const path = spec.path
    const method = spec.method
    const validate = Hoek.reach(spec, 'config.validate')
    const id = Hoek.reach(spec, 'config.id')
    const handler = Hoek.reach(spec, 'config.handler')
    const validatorMiddleware = this.validator(validate)

    should.exist(path, `'path' should be defined on route ${path}`)

    const middlewares = [
      validatorMiddleware,
      handler
    ]

    const fullPath = `${basePath || ''}${path}`

    debug(fullPath)

    route[method](fullPath, ...middlewares)
  }

  /**
   * middleware bedore handler
   *
   * @api private
   */
  private validator (validate) {
    return async (ctx, next) => {
      validate && await validator.valid(validate, ctx)

      await next()
    }
  }

  /**
   * call swagger builder
   */
  private buildSwagger () {
    const { basePath } = this.options
    // const fileList = this.finder.findRouteFiles()
    const customSetting = { basePath }
    const routes = this.finder.routes
    swaggerServer.start({
      app: this.app,
      // fileList,
      routes,
      customSetting
    })
  }

  private load () {
    return this.router.routes()
  }

  private allowedMethods () {
    return this.router.allowedMethods()
  }

  private useRoute () {
    const routes = this.load()
    const allowedMethods = this.allowedMethods()
    this.app
      .use(routes)
      .use(allowedMethods)
  }
}
