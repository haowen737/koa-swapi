const fs = require('fs')
const path = require('path')
const debug = require('debug')('apiFinder')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_CONTROLLER = path.resolve(PATH_APP, './controller')
const PATH_CTRL = dir => path.resolve(PATH_APP, './controller', dir)

class Finder {
  constructor () {
    this.init()
    this.routes = []
  }
  init () {
    if (!fs.existsSync(PATH_ROUTE)) {
      throw new Error('未找到路由文件路径')
    }
    this.routeFiles = fs.readdirSync(PATH_ROUTE)
    this.controllerFiles = fs.readdirSync(PATH_CONTROLLER)
  }

  /**
   * build api & store in routes array;
   * api is built with handler and spec
   */
  combineRoutes () {

    this.routeFiles.forEach(dir => {

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

      if (!controller) { throw new Error(`controller for route ${spe.path} not defined`) }

      spe.handler = controller

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

    if (!ctrlExist) { throw new Error(`route ${dir} should have controller defined`) }
    
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

module.exports = Finder
