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
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const chalk = require('chalk');
const debug = require('debug')('swagger:server');
const SwaggerUI = require('../public/swagger-ui-dist');
const swaggerBuilder_1 = require("./swaggerBuilder");
const setting = require('./defaults');
const server = new Koa();
const printf = console.log;
const swaggerUiAssetPath = SwaggerUI.getAbsoluteFSPath();
const { documentationPath, jsonPath } = setting;
class swaggerServer {
    start({ app, fileList, routes, customSetting }) {
        server.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            if (ctx.path === documentationPath) { // koa static barfs on root url w/o trailing slash
                ctx.redirect(ctx.path + '/');
            }
            else {
                yield next();
            }
        }));
        server.use(mount(documentationPath, serve(swaggerUiAssetPath)));
        // printf(chalk.blue.bold('koa-swapi'), 'document build succeed, path', chalk.blue(documentationPath))
        debug('documentationPath', documentationPath);
        server.use(mount(jsonPath, (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const swaggerJSON = yield swaggerBuilder_1.default.build(routes, customSetting, ctx);
            ctx.body = JSON.stringify(swaggerJSON);
        })));
        app.use(mount(server));
    }
}
// module.exports = function server (desc) {
//   serveSwagger(desc)
//   return mount(swaggerServer, '/')
// }
exports.default = new swaggerServer();
//# sourceMappingURL=swaggerServer.js.map