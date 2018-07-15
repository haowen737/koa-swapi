import * as Joi from 'joi'
import * as Hoek from "hoek"
import * as should from "should"
import * as debug from "debug"

import RouteSchema from './schemas/route'
import { Route, RouteConfigValidate } from './interfaces/RouteConfig.interface'

const DEBUG = debug("swapi:apiBuilder")

interface RawRoute {
  id: string,
  route: Route
}

interface SwapiRoute {
  isSwapiRoute?: boolean
  _path: string
  _method: string
  _tags: string[]
  _id: string
  _summary: string
  _description: string
  _validate: RouteConfigValidate
}

class ApiBuilder {
  private routes: Route[] = []
  private rawRoutes: RawRoute[] = []

  constructor() {

  }

  handler(handlers: any[]) {
    const builtRoutes = []
    for (let i = 0; i < this.rawRoutes.length; i++) {
      const rawRoute = this.rawRoutes[i]
      const { id, route } = rawRoute

      // use id match controller
      should.exist(id, `Expect get id defined for route ${route.path}`)

      const handler = route.config.handler || handlers[id]

      should.exist(handler, `Expect get controller ${id} but got ${handler}`)
      should(handler).be.a.Function()

      route.config.handler = handler

      DEBUG(`build route ${route.path}`)

      builtRoutes.push(route)
    }

    this.rawRoutes = []

    return builtRoutes
  }

  schemas(routes: SwapiRoute[]) 
  schemas(routes: Route[])
  schemas(routes: any[]) {
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i]

      if (route._isSwapiRoute) {
        route = this.readSwapiRoute(route)
      }
      // Joi.assert(route, RouteSchema)

      const id = Hoek.reach(route, 'config.id')
      
      this.rawRoutes.push({ id, route })
    }

    return this
  }

  private readSwapiRoute (route: SwapiRoute) {
    const obj: Route = {}
    obj.path = route._path
    obj.method = route._method

    obj.config = {}
    obj.config.id = route._id
    obj.config.tags = route._tags
    obj.config.summary = route._summary
    obj.config.description = route._description

    if (route._validate && route._validate._isSwapiValidator) {
      obj.config.validate = this.readSwapiValitador(route._validate)
    }

    return obj
  }

  private readSwapiValitador (validator: any) {
    if (!validator) { return }
    const obj: any = {}

    obj.query = validator._query
    obj.params = validator._params
    obj.payload = validator._payload
    obj.type = validator._type
    obj.output = validator._output

    return obj
  }

  buildByArray(routes: Route[]) {}
}

export default new ApiBuilder()