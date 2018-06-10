const fs = require('fs')
const path = require('path')
const debug = require('debug')('swagger-builder')

const swaggerServer = require('./swaggerServer')
const Builder = require('./swagger/builder')

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, './routes')
const defaults = require('./defaults')

const internals: any = {}

class swaggerBuilder {
  public build = async function (routes, customOption, ctx) {

    const appInfo = internals.readAppPkg()
    const settings = Object.assign(defaults, appInfo, customOption)
  
    return await Builder.getSwaggerJSON(settings, routes, ctx)
  }
}

/**
 * return each route path
 */
internals.parseRoute = function (dir) {
  return path.resolve(PATH_ROUTE, dir)
}

internals.readAppPkg = function () {
  const packageDir = path.resolve(PATH_APP, './package.json')

  if (!fs.existsSync(packageDir)) {
    return {}
  }

  const pkg = require(packageDir)

  const { name, version, description, license } = pkg

  const info: any = Object.assign({}, {
    version: version || null,
    description: description || null,
    license: license ? { name: license } : null
  }, {
    title: name || null
  })

  delete info.name

  return { info }
}

export default new swaggerBuilder()
