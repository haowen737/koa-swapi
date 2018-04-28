const fs = require('fs')
const path = require('path')
const debug = require('debug')('apiFinder')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const PATH_ROUTE_INDEX = path.resolve(PATH_APP, './routes/index.js')

class Finder {
  constructor() {
    this.init()
  }
  init () {
    if (!fs.existsSync(PATH_ROUTE)) {
      throw new Error('未找到路由文件路径')
    }
    this.list = fs.readdirSync(PATH_ROUTE)
  }
  routes () {
    const routes = []
    
    this.list.forEach(dir => {
      const routeDir = this._parseRoute(dir)
      const route = require(routeDir)
      route instanceof Array
        ? routes.push(...route)
        : routes.push(route)

      debug(dir)
    })

    return routes
  }
  fileName () {
    const files = []

    this.list.forEach(dir => {
      files.push(dir.toString())
    })

    return files
  }
  _parseRoute (dir) {
    return path.resolve(PATH_APP, './routes', dir)
  }
}

module.exports = Finder
