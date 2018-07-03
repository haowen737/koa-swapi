"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const debug = require("debug");
const swagger_1 = require("./defaults/swagger");
const mocker_1 = require("./defaults/mocker");
const PATH_APP = process.cwd();
const PATH_FILE = path.resolve(PATH_APP, "./swapi.json");
const DEBUG = debug("koapi:configSeeker");
class ConfigSeeker {
    constructor() {
        if (!fs.existsSync(PATH_FILE)) {
            return;
        }
        const raw = fs.readFileSync(PATH_FILE, 'utf8');
        try {
            this.foo = JSON.parse(raw);
        }
        catch (e) {
            throw new Error('damn!');
        }
        this.swagger = this.meltSwagger();
        this.mocker = this.meltMocker();
        this.base = this.meltBase();
    }
    meltSwagger() {
        const { swagger } = this.foo;
        return Object.assign({}, swagger_1.default, swagger);
    }
    meltMocker() {
        const { mocker } = this.foo;
        return Object.assign({}, mocker_1.default, mocker);
    }
    meltBase() {
        const { basePath } = this.foo;
        return Object.assign({}, { basePath });
    }
}
exports.default = new ConfigSeeker();
//# sourceMappingURL=index.js.map