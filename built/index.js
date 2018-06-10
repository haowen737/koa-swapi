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
const Hoek = require("hoek");
const KoaRouter = require("koa-router");
const debug = require("debug");
const apiFinder_1 = require("./apiFinder");
const swaggerServer_1 = require("./swaggerServer");
const validator_1 = require("./validator");
/**
 * Expose Swapi class
 * Inherits from KoaRouter.prototype
 */
class Swapi {
    constructor() {
        this.routes = [];
        this.router = new KoaRouter();
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
            this.finder = new apiFinder_1.default({ routes: options.routes });
            this.app = app;
            this.options = options;
            this.buildKoaRoutes();
            this.buildSwagger();
            return this;
        });
    }
    /**
     * step 1: build koa router;
     * routes can be passed from params or use api finder find;
     * api finder will automatically find /routes and /controllers;
     */
    buildKoaRoutes() {
        const routes = this.options.routes;
        const routeList = routes
            ? this.finder.combineControllers(routes)
            : this.finder.combineRoutes();
        for (let i = 0; i < routeList.length; i++) {
            const spec = routeList[i];
            // this.routes.push(spec)
            this.createRoute(spec);
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
        const { basePath } = this.options;
        const route = this.router;
        const path = spec.path;
        const method = spec.method;
        const validate = Hoek.reach(spec, 'config.validate');
        const id = Hoek.reach(spec, 'config.id');
        const handler = Hoek.reach(spec, 'config.handler');
        const validatorMiddleware = this.validator(validate);
        if (!method) {
            throw new Error('method is undefined');
        }
        if (!path) {
            throw new Error('path is undefined');
        }
        if (!handler) {
            throw new Error('handler is undefined');
        }
        const middlewares = [
            validatorMiddleware,
            handler
        ];
        const fullPath = `${basePath || ''}${path}`;
        debug(fullPath);
        route[method](fullPath, ...middlewares);
    }
    /**
     * middleware bedore handler
     *
     * @api private
     */
    validator(validate) {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            validate && (yield validator_1.default.valid(validate, ctx));
            yield next();
        });
    }
    /**
     * call swagger builder
     */
    buildSwagger() {
        const { basePath } = this.options;
        // const fileList = this.finder.findRouteFiles()
        const customSetting = { basePath };
        const routes = this.finder.routes;
        swaggerServer_1.default.start({
            app: this.app,
            // fileList,
            routes,
            customSetting
        });
    }
    load() {
        return this.router.routes();
    }
    allowedMethods() {
        return this.router.allowedMethods();
    }
    useRoute() {
        const routes = this.load();
        const allowedMethods = this.allowedMethods();
        this.app
            .use(routes)
            .use(allowedMethods);
    }
}
exports.Swapi = Swapi;
//# sourceMappingURL=index.js.map