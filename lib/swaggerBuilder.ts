
import * as debug from "debug"
import * as fs from "fs"
import * as path from "path"

// import defaults from "./configSeeker/defaults/swagger"
import * as builder from "./swagger/builder"

const PATH_APP = process.cwd()
const PATH_ROUTE = path.resolve(PATH_APP, "./routes")
const DEBUG = debug("swagger-builder")

const internals: any = {}

class SwaggerBuilder {
  public async build(apis, setting, ctx) {

    const appInfo = internals.readAppPkg()
    const settings = Object.assign(appInfo, setting)

    return await builder.getSwaggerJSON(settings, apis, ctx)
  }
}

/**
 * return each route path
 */
internals.parseRoute = (dir) => {
  return path.resolve(PATH_ROUTE, dir)
}

internals.readAppPkg = () => {
  const packageDir = path.resolve(PATH_APP, "./package.json")

  if (!fs.existsSync(packageDir)) {
    return {}
  }

  const pkg = require(packageDir)

  const { name, version, description, license } = pkg

  const info: any = Object.assign({}, {
    version: version || null,
    description: description || null,
    license: license ? { name: license } : null,
  }, {
    title: name || null,
  })

  delete info.name

  return { info }
}

export default new SwaggerBuilder()
