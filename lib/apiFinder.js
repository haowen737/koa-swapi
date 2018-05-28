const fs = require('fs')
const path = require('path')
const debug = require('debug')('apiFinder')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_CONTROLLER = path.resolve(PATH_APP, './controller')

class Finder {
  constructor () {
    this.init()
  }
  init () {
    if (!fs.existsSync(PATH_ROUTE)) {
      throw new Error('未找到路由文件路径')
    }
    this.routeFiles = fs.readdirSync(PATH_ROUTE)
    this.controllerFiles = fs.readdirSync(PATH_CONTROLLER)
  }
  combineRoutes () {
    const routes = []

    this.routeFiles.forEach(dir => {
      // this
      //   .hasController()
      //   .then(() => {

      //   })

      const routeDir = this._parseRoute(dir)
      const route = require(routeDir)
      route instanceof Array
        ? routes.push(...route)
        : routes.push(route)

      debug(dir)
    })

    return routes
  }
  findController ({ id }) {
    
  }
  findRouteFiles () {
    const files = []

    this.routeFiles.forEach(dir => {
      files.push(dir.toString())
    })

    return files
  }
  _parseRoute (dir) {
    return path.resolve(PATH_APP, './routes', dir)
  }
}

module.exports = Finder
