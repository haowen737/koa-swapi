interface Swagger {
  debug: boolean,
  jsonPath: string,
  documentationPath:  string,
  documentationRouteTags: any[],
  swaggerUIPath: string,
  auth: boolean,
  pathPrefixSize: 1,
  payloadType: string,
  documentationPage: boolean,
  swaggerUI: boolean,
  jsonEditor: boolean,
  expanded: string, // none, list or full
  lang: string,
  sortTags: string,
  sortEndpoints: string,
  sortPaths: string,
  grouping: string,
  tagsGroupingFilter: any,
  uiCompleteScript: null,
  xProperties: boolean,
  reuseDefinitions: boolean,
  definitionPrefix: string,
  deReference: boolean,
  validatorUrl: string,
  acceptToProduce: boolean, // internal, NOT public
  pathReplacements: any[],
}

interface Mocker {
  path?: string
}

export interface SwapiConfig {
  basePath?: string,
  swagger?: Swagger,
  mocker?: Mocker
}