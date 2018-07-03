import chalk from "chalk"
import * as debug from "debug"
import * as Koa from "koa"
import mount from "koa-mount"
import * as serve from "koa-static"
import * as SwaggerUI from "../public/swagger-ui-dist"

import setting from "./config/defaults/swagger"
import swaggerBuilder from "./swaggerBuilder"

const server = new Koa()
const printf = console.log
const DEBUG = debug("swagger:server")

const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath()

const { documentationPath, jsonPath } = setting

interface SwaggerServerOption {
  app: any
  fileList?: any
  routes: any
  customSetting: any
}

class SwaggerServer {
  public start({
    app,
    fileList,
    routes,
    customSetting,
  }: SwaggerServerOption) {
    server.use(async (ctx, next) => {
      if (ctx.path === documentationPath) { // koa static barfs on root url w/o trailing slash
        ctx.redirect(ctx.path + "/")
      } else {
        await next()
      }
    })

    server.use(mount(documentationPath, serve(swaggerUiAssetPath)))

    printf(chalk.blue.bold("koa-swapi"), "document build succeed, path", chalk.blue(documentationPath))
    DEBUG("documentationPath", documentationPath)

    server.use(mount(jsonPath, async (ctx, next) => {
      const swaggerJSON = await swaggerBuilder.build(routes, customSetting, ctx)

      ctx.body = JSON.stringify(swaggerJSON)
    }))

    app.use(mount(server))
  }
}

// module.exports = function server (desc) {
//   serveSwagger(desc)

//   return mount(swaggerServer, '/')
// }

export default new SwaggerServer()
