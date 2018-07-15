export interface RouteConfigValidate {
  query?: any
  params?: any
  payload?: any
  type?: string
  output?: any,
  _isSwapiValidator?: boolean
}

export interface RouteConfig {
  summary?: string,
  id?: string,
  tags?: string[],
  description?: string,
  validate?: RouteConfigValidate,
  handler?: () => {}
}

export interface Route {
  method?: string,
  path?: string,
  config?: RouteConfig
}