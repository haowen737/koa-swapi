import chalk from "chalk"
import * as debug from "debug"
import * as Koa from "koa"
import * as mount from "koa-mount"
import * as serve from "koa-static"
import * as SwaggerUIDist from "../public/swagger-ui-dist"

// import setting from "./configSeeker/defaults/swagger"
import swaggerBuilder from "./swaggerBuilder"

const server = new Koa()
const printf = console.log
const DEBUG = debug("swagger:server")

const swaggerUiAssetPath = SwaggerUIDist.getAbsoluteFSPath()

// const { documentationPath, jsonPath } = setting

interface SwaggerServerOption {
  app: any
  fileList?: any
  apis: any
  setting: any
}

class SwaggerServer {
  public start({
    app,
    fileList,
    apis,
    setting,
  }: SwaggerServerOption) {
    const { documentationPath, jsonPath } = setting
    console.log('documentationPath---', documentationPath, swaggerUiAssetPath)
    // server.use(async (ctx, next) => {
    //   if (ctx.path === documentationPath) { // koa static barfs on root url w/o trailing slash
    //     ctx.redirect(ctx.path + "/")
    //   } else {
    //     await next()
    //   }
    // })

    server.use(mount(documentationPath, serve(swaggerUiAssetPath)))

    printf(chalk.blue.bold("koa-swapi"), "document build succeed, path", chalk.blue(documentationPath))
    DEBUG("documentationPath", documentationPath)

    server.use(mount(jsonPath, async (ctx, next) => {
      const swaggerJSON = await swaggerBuilder.build(apis, setting, ctx)

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
