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
const debug = require("debug");
const fs = require("fs");
const path = require("path");
const defaults_1 = require("./defaults");
const builder = require("./swagger/builder");
const PATH_APP = process.cwd();
const PATH_ROUTE = path.resolve(PATH_APP, "./routes");
const DEBUG = debug("swagger-builder");
const internals = {};
class SwaggerBuilder {
    build(routes, customOption, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const appInfo = internals.readAppPkg();
            const settings = Object.assign(defaults_1.default, appInfo, customOption);
            return yield builder.getSwaggerJSON(settings, routes, ctx);
        });
    }
}
/**
 * return each route path
 */
internals.parseRoute = (dir) => {
    return path.resolve(PATH_ROUTE, dir);
};
internals.readAppPkg = () => {
    const packageDir = path.resolve(PATH_APP, "./package.json");
    if (!fs.existsSync(packageDir)) {
        return {};
    }
    const pkg = require(packageDir);
    const { name, version, description, license } = pkg;
    const info = Object.assign({}, {
        version: version || null,
        description: description || null,
        license: license ? { name: license } : null,
    }, {
        title: name || null,
    });
    delete info.name;
    return { info };
};
exports.default = new SwaggerBuilder();
//# sourceMappingURL=swaggerBuilder.js.map