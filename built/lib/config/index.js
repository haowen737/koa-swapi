"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const debug = require("debug");
const swagger_1 = require("./defaults/swagger");
const PATH_APP = process.cwd();
const PATH_FILE = path.resolve(PATH_APP, "./swapi.json");
const DEBUG = debug("koapi:configSeeker");
class ConfigSeeker {
    constructor() {
        const configJson = fs.readFileSync(PATH_FILE, 'utf8');
        try {
            this.foo = JSON.parse(configJson);
        }
        catch (e) {
            throw new Error('damn!');
        }
        this.swagger = this.meltSwagger();
    }
    meltSwagger() {
        const { swagger } = this.foo;
        return Object.assign({}, swagger_1.default, swagger);
    }
}
exports.default = new ConfigSeeker();
//# sourceMappingURL=index.js.map