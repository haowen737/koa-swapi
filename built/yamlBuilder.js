/*
 * 废弃的文件，目前koa-swapi并不打算生成yaml文件
 */
const Joi = require('joi');
const j2s = require('joi-to-swagger');
const { cloneDeep } = require('lodash');
// const swaggerBase = require('./swaggerBase')
const validTarget = ['query', 'params', 'body'];
const _parseJoi = function (joiTarget) {
    const parsedTarget = {};
    validTarget.forEach(t => {
        const targets = joiTarget[t];
        if (targets) {
            const schema = Joi.object().keys(Object.assign({}, targets));
            const { swagger } = j2s(schema);
            parsedTarget[t] = swagger;
        }
    });
    return parsedTarget;
};
const _parseTag = function (tags = []) {
    const parsedTags = [];
    tags.forEach(t => {
        const tag = {};
        tag.name = t;
        parsedTags.push(tag);
    });
    return parsedTags;
};
const _parseParameters = function (params) {
    return [];
};
const yamlBuilder = module.exports = {};
// TODO: 格式化json {paths: {route: {method: {}}}
yamlBuilder.buildSpec = function (specList) {
    const paths = [];
    const parameters = [];
    const allTags = [];
    const _spec = {};
    specList.forEach((spec, index) => {
        const specCopy = cloneDeep(spec);
        const { validate, tags } = specCopy;
        const cur = {};
        cur[specCopy.method] = {};
        cur[specCopy.method].summary = specCopy.summary || '';
        cur[specCopy.method].description = specCopy.description || '';
        cur[specCopy.method].tags = specCopy.tags || [];
        _spec[specCopy.path] = _spec[specCopy.path] || {};
        Object.assign(_spec[specCopy.path], cur);
        // const _parameters = _parseParameters(validate)
        cur[specCopy.method].parameters = validate;
        tags && allTags.push(..._parseTag(tags));
    });
    paths.push(_spec);
    return { paths, tags: allTags };
};
yamlBuilder.build = function (desc) {
    const descCopy = cloneDeep(desc);
    // const descriptor = swaggerBase
    descriptor.info.description = descCopy.description;
    descriptor.info.version = descCopy.version;
    descriptor.info.title = descCopy.title;
    descriptor.info.termsOfService = descCopy.termsOfService;
    descriptor.paths = descCopy.paths;
    descriptor.tags = descCopy.tags;
    return descriptor;
};
//# sourceMappingURL=yamlBuilder.js.map