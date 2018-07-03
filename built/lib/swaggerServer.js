"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const debug = require("debug");
const Koa = require("koa");
const koa_mount_1 = require("koa-mount");
const serve = require("koa-static");
const SwaggerUI = require("../public/swagger-ui-dist");
const swagger_1 = require("./config/defaults/swagger");
const swaggerBuilder_1 = require("./swaggerBuilder");
const server = new Koa();
const printf = console.log;
const DEBUG = debug("swagger:server");
const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath();
const { documentationPath, jsonPath } = swagger_1.default;
class SwaggerServer {
    start({ app, fileList, routes, customSetting, }) {
        server.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            if (ctx.path === documentationPath) { // koa static barfs on root url w/o trailing slash
                ctx.redirect(ctx.path + "/");
            }
            else {
                yield next();
            }
        }));
        server.use(koa_mount_1.default(documentationPath, serve(swaggerUiAssetPath)));
        printf(chalk_1.default.blue.bold("koa-swapi"), "document build succeed, path", chalk_1.default.blue(documentationPath));
        DEBUG("documentationPath", documentationPath);
        server.use(koa_mount_1.default(jsonPath, (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const swaggerJSON = yield swaggerBuilder_1.default.build(routes, customSetting, ctx);
            ctx.body = JSON.stringify(swaggerJSON);
        })));
        app.use(koa_mount_1.default(server));
    }
}
// module.exports = function server (desc) {
//   serveSwagger(desc)
//   return mount(swaggerServer, '/')
// }
exports.default = new SwaggerServer();
//# sourceMappingURL=swaggerServer.js.map