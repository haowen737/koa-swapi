export interface RouteConfigValidate {
  query: any
  params: any
  payload: any
  type: string
  output: any
}

export interface RouteConfig {
  summary: string,
  description: string,
  validate: RouteConfigValidate,
}

export interface Route {
  method: string,
  path: string,
  config: RouteConfig
}