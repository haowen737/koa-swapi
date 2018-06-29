// Code from https://github.com/glennjones/hapi-swagger
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SwaggerParser = require('swagger-parser');
const validate = module.exports = {};
/**
 * validate a JSON swagger document and log output
 * logFnc pattern function(array,string){}
 *
 * @param  {Object} doc
 * @param  {Object} logFnc
 * @return {Object}
 */
validate.log = (doc, logFnc) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield SwaggerParser.validate(doc);
        logFnc(['validation', 'info'], 'PASSED - The swagger.json validation passed.');
        return true;
    }
    catch (err) {
        logFnc(['validation', 'error'], `FAILED - ${err.message}`);
        return false;
    }
});
/**
 * validate a JSON swagger document
 *
 * @param  {Object} doc
 * @param  {Object} next
 * @return {Object}
 */
validate.test = (doc) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield SwaggerParser.validate(doc);
        return true;
    }
    catch (err) {
        return false;
    }
});
//# sourceMappingURL=validate.js.map