import * as Joi from 'joi'
import * as Hoek from "hoek"
import * as should from "should"

import RouteSchema from './schemas/route'
import { Route } from './interfaces/RouteConfig.interface'

interface RawRoute {
  id: string,
  route: Route
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

      builtRoutes.push(route)
    }

    this.rawRoutes = []

    return builtRoutes
  }

  schemas(routes: Route[]) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      Joi.assert(route, RouteSchema)

      const id = Hoek.reach(route, 'config.id')
      
      this.rawRoutes.push({ id, route })
    }

    return this
  }

  buildByArray(routes: Route[]) {}
}

export default new ApiBuilder()