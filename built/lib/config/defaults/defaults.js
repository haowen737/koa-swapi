"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// defaults settings for plug-in
exports.default = {
    debug: false,
    jsonPath: "/swagger.json",
    documentationPath: "/documentation",
    documentationRouteTags: [],
    swaggerUIPath: "/swaggerui/",
    auth: false,
    pathPrefixSize: 1,
    payloadType: "json",
    documentationPage: true,
    swaggerUI: true,
    jsonEditor: false,
    expanded: "list",
    lang: "en",
    sortTags: "default",
    sortEndpoints: "path",
    sortPaths: "unsorted",
    grouping: "path",
    tagsGroupingFilter: (tag) => tag !== "api",
    uiCompleteScript: null,
    xProperties: true,
    reuseDefinitions: true,
    definitionPrefix: "default",
    deReference: false,
    validatorUrl: "//online.swagger.io/validator",
    acceptToProduce: true,
    pathReplacements: [],
};
//# sourceMappingURL=defaults.js.map