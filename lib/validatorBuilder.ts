import { RouteConfigValidate } from './interfaces/RouteConfig.interface'

interface Internal {
  build?
  melt?
}

const Builder = function() {
  return new internal.build()
}

const internal: Internal = {}

internal.melt = function () {
  const obj = this.clone()
  return obj
}
internal.build = class {
  raw: RouteConfigValidate = {}
  path: string
  id: string

  clone() {
    const obj = Object.create(Object.getPrototypeOf(this))

    obj._query = this.raw.query
    obj._params = this.raw.params
    obj._payload = this.raw.payload
    obj._type = this.raw.type
    obj._output = this.raw.output

    obj.query = this.query
    obj.params = this.params
    obj.payload = this.payload
    obj.type = this.type
    obj.output = this.output

    obj._isSwapiValidator = true

    return obj
  }

  query = (obj: any) => this.handleJoiObj('query', obj)

  params = (obj: any) => this.handleJoiObj('params', obj)

  payload = (obj: any) => this.handleJoiObj('payload', obj)

  output = (obj: any) => this.handleJoiObj('output', obj)

  type (type: string) {
    this.raw.type = type

    return internal.melt.call(this)
  }

  private handleJoiObj (type: any, obj: any) {
    this.raw[type] = obj

    return internal.melt.call(this)
  }

}


export default Builder()