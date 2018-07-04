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
// import * as Hoek from 'hoek'
const debug = require("debug");
const Hoek = require("hoek");
const KoaRouter = require("koa-router");
const should = require("should");
const apiFinder_1 = require("./apiFinder");
const config_1 = require("./config");
const swaggerServer_1 = require("./swaggerServer");
const validator_1 = require("./validator");
/**
 * Expose Swapi class
 * Inherits from KoaRouter.prototype
 */
class Swapi {
    constructor() {
        this.routes = [];
        this.koaRouter = new KoaRouter();
        this.config = config_1.default.base;
    }
    /**
     * Main func,
     *  step1: build koa router;
     *  step 2: build swagger documant;
     * options include custom settings and routes(for version 1.0)
     * @param {Server} app
     * @param {Object} options
     * @returns
     * @memberof Swapi
     */
    register(app, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routes, middleware } = options;
            this.finder = new apiFinder_1.default({ routes });
            // this.options = options
            this.middleware = middleware || [];
            this.app = app;
            this.buildKoaRoutes(routes);
            this.buildSwagger();
            return this;
        });
    }
    /**
     * step 1: build koa router;
     * routes can be passed from params or use api finder find;
     * api finder will automatically find /routes and /controllers;
     */
    buildKoaRoutes(routes) {
        const routeList = routes
            ? this.finder.combineControllers(routes)
            : this.finder.combineRoutes();
        for (const spec in routeList) {
            if (routeList[spec]) {
                this.createRoute(routeList[spec]);
            }
        }
        this.useRoute();
    }
    /**
     * add multiple middleware to koa-router, build koa router
     *
     * @param {any} spec
     * @memberof Swapi
     */
    createRoute(spec) {
        const { basePath } = this.config;
        const route = this.koaRouter;
        // const customMiddleware = this.customMiddleware()
        const customMiddleware = this.middleware;
        const path = spec.path;
        const method = spec.method;
        const validate = Hoek.reach(spec, "config.validate");
        const id = Hoek.reach(spec, "config.id");
        const handler = Hoek.reach(spec, "config.handler");
        const validatorMiddleware = this.validator(validate);
        should.exist(path, `'path' should be defined on route ${path}`);
        const middleware = [
            validatorMiddleware,
            ...customMiddleware,
            handler,
        ];
        const fullPath = `${basePath || ""}${path}`;
        debug(fullPath);
        route[method](fullPath, ...middleware);
    }
    /**
     * middleware bedore handler
     *
     * @api private
     */
    validator(validate) {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            if (validate) {
                validator_1.default.valid(validate, ctx);
            }
            yield next();
        });
    }
    /**
     * call swagger builder
     */
    buildSwagger() {
        const { basePath } = this.config;
        // const fileList = this.finder.findRouteFiles()
        const customSetting = { basePath };
        const routes = this.finder.routes;
        swaggerServer_1.default.start({
            app: this.app,
            // fileList,
            routes,
            customSetting,
        });
    }
    load() {
        return this.koaRouter.routes();
    }
    allowedMethods() {
        return this.koaRouter.allowedMethods();
    }
    useRoute() {
        const routes = this.load();
        const allowedMethods = this.allowedMethods();
        this.app
            .use(routes)
            .use(allowedMethods);
    }
}
exports.default = Swapi;
//# sourceMappingURL=swapi.js.map