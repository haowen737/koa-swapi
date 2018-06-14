const fs = require('fs')
const path = require('path')
const debug = require('debug')('apiFinder')
const should = require('should')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_CONTROLLER = path.resolve(PATH_APP, './controller')
const PATH_CTRL = dir => path.resolve(PATH_APP, './controller', dir)

import { Route } from './intefaces/RouteConfig.interface'

/**
 * silent means user pass routes as parameters
 *
 * @class Finder
 */
export default class Finder {
  private routeFiles: Array<String>
  private controllerFiles: Array<String>

  public routes: Array<Route>
  
  constructor ({
    routes
  }) {
    this.routes = routes || []
    this.routeFiles = []
    this.controllerFiles = []

    routes
      ? this.hotStart()
      : this.coldStart()
  }

  /**
   *
   *
   * @memberof Finder
   */
  // TODO: 当routes以参数传入时，apiFinder的运行应该完全不一样
  hotStart () {

  }

  // FIXME: 决定是否抛出错误，没有传入routes且没有找到routes目录的情况下
  coldStart () {
    if (!fs.existsSync(PATH_ROUTE)) {
      // throw new Error('未找到路由文件路径')
      return
    }
    this.routeFiles = fs.readdirSync(PATH_ROUTE) || []
    this.controllerFiles = fs.readdirSync(PATH_CONTROLLER) || []
  }

  /**
   * user pass routes when register swapi;
   * need find controller for each route;
   * regDoubleSlash for match path: /dog/:id
   * regSingleSlash for match path /dog
   */
  combineControllers (routes) {
    const regDoubleSlash = /\/(\w+)\//
    const regSingleSlash = /\/(\w+)/
    routes.forEach(route => {
      if (route.config.handler) {
        this.routes.push(route)
        return
      }

      const possibleRouteName = route.path.match(regDoubleSlash) || route.path.match(regSingleSlash)

      if (!possibleRouteName) { throw new Error('path is undefined') }

      const controllerFileName = `${possibleRouteName[0].replace(/\//g, '')}.js`
      const handler = this.findController(controllerFileName)

      this.decorateRoute(route, handler)
    })
    return this.routes
  }

  /**
   * user didn't padd routes when register swapi;
   * build api & store in routes array;
   * api is built with handler and spec
   */
  combineRoutes () {
    this.routeFiles.forEach(dir => {
      // ignore index file, index file means all route in array
      // when index file exist supposed not call this function
      if (dir === 'index.js') { return }

      const handler = this.findController(dir)
      const routeDir = this._parseRoute(dir)

      const spec = require(routeDir)

      this.decorateRoute(spec, handler)

      debug('combine dir', dir)
    })

    return this.routes
  }

  decorateRoute (spec, handler) {
    spec = spec instanceof Array ? spec : [spec]

    spec.forEach(spe => {
      debug('decorateRoute', spe.path)

      const method = spe.method
      const id = spe.id
      const controller = handler[method] || handler[id]

      should.exist(method, `'method' should be defined on route ${spe.path}`)
      should.exist(controller, `'controller' should be defined on route ${spe.path}`)

      if (!spe.config.handler) {
        spe.config.handler = controller
      }

      this.routes.push(spe)
    })
  }

  /**
   * find controller by router;
   * controller will be named the same as router;
   * handler in controller should be named by method or id
   */
  findController (dir) {
    const ctrlPath = PATH_CTRL(dir)
    const ctrlExist = fs.existsSync(ctrlPath)

    should.exist(ctrlExist, `route ${dir} should have controller defined`)

    return require(ctrlPath)
  }

  /**
   * return all files path;
   * probably used by swagger builder;
   */
  findRouteFiles () {
    const files = []

    this.routeFiles.forEach(dir => {
      files.push(dir.toString())
    })

    return files
  }

  /**
   * get specific route dir
   */
  _parseRoute (dir) {
    return path.resolve(PATH_APP, './routes', dir)
  }
}
