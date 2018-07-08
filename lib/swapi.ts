// import * as Hoek from 'hoek'
import * as debug from "debug"
import * as Hoek from "hoek"
import * as Koa from "koa"
import * as KoaRouter from "koa-router"
import * as should from "should"

import Finder from "./apiFinder"
import ConfigSeeker from "./configSeeker"
import swaggerServer from "./swaggerServer"
import validator from "./validator"

import { Route } from "./interfaces/RouteConfig.interface"

interface Argv {
  routes?: Route[]
  middleware?: any[]
  options?: any
}

/**
 * Expose Swapi class
 * Inherits from KoaRouter.prototype
 */
export default class Swapi {
  private routes: KoaRouter[]
  private koaRouter: KoaRouter
  private middleware: any[]
  // private options: Options
  private config: any
  private finder: Finder
  private app: Koa

  constructor() {
    this.routes = []
    this.koaRouter = new KoaRouter()
  }

  /**
   * Main func,
   *  step1: build koa router;
   *  step 2: build swagger documant;
   * options include custom settings and routes(for version 1.0)
   * @param {Server} app
   * @param {Object} argv
   * @returns
   * @memberof Swapi
   */
  public async register(app: Koa, argv: Argv = {}) {
    const { options = {}, routes, middleware } = argv
    this.finder = new Finder({ routes })
    this.config = new ConfigSeeker(options)
    // this.options = options
    this.middleware = middleware || []
    this.app = app

    this.buildKoaRoutes(routes)
    this.buildSwagger()

    return this
  }

  /**
   * step 1: build koa router;
   * routes can be passed from params or use api finder find;
   * api finder will automatically find /routes and /controllers;
   */
  private buildKoaRoutes(routes) {
    const routeList = routes
      ? this.finder.combineControllers(routes)
      : this.finder.combineRoutes()

    for (const spec in routeList) {
      if (routeList[spec]) {
        this.createRoute(routeList[spec])
      }
    }

    this.useRoute()
  }

  /**
   * add multiple middleware to koa-router, build koa router
   *
   * @param {any} spec
   * @memberof Swapi
   */
  private createRoute(spec: Route) {
    const { basePath } = this.config.base
    const route = this.koaRouter
    // const customMiddleware = this.customMiddleware()
    const customMiddleware = this.middleware
    const path = spec.path
    const method = spec.method
    const validate = Hoek.reach(spec, "config.validate")
    const id = Hoek.reach(spec, "config.id")
    const handler = Hoek.reach(spec, "config.handler")
    const validatorMiddleware = this.validator(validate)

    should.exist(path, `'path' should be defined on route ${path}`)
    const middleware = [
      validatorMiddleware,
      ...customMiddleware,
      handler,
    ]

    const fullPath = `${basePath || ""}${path}`

    debug(fullPath)

    route[method](fullPath, ...middleware)
  }

  /**
   * middleware bedore handler
   *
   * @api private
   */
  private validator(validate) {
    return async (ctx, next) => {
      if (validate) {
        validator.valid(validate, ctx)
      }

      await next()
    }
  }

  /**
   * call swagger builder
   */
  private buildSwagger() {
    // const { basePath } = this.config
    // const fileList = this.finder.findRouteFiles()
    // const customSetting = { basePath }
    const setting = this.config.swagger
    const routes = this.finder.routes
    swaggerServer.start({
      app: this.app,
      // fileList,
      routes,
      setting,
    })
  }

  private load() {
    return this.koaRouter.routes()
  }

  private allowedMethods() {
    return this.koaRouter.allowedMethods()
  }

  private useRoute() {
    const routes = this.load()
    const allowedMethods = this.allowedMethods()

    this.app
      .use(routes)
      .use(allowedMethods)
  }
}
