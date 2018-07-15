import * as Hoek from 'hoek'

interface Internal {
  root?
}

class Any {
  _isSwapiValidator: boolean
  _target: any
  
  constructor() {
    this._isSwapiValidator = true
    this._target = {}
  }

  _init() {
    return this
  }

  clone() {
    const obj: any = Object.create(Object.getPrototypeOf(this))

    obj._isSwapiValidator = true
    obj._target = Hoek.clone(this._target)

    obj.query = this.query
    obj.params = this.params
    obj.payload = this.payload
    obj.type = this.type
    obj.output = this.output

    return obj
  }

  params(schema: any) {
    const obj = this.clone()
    obj._target.params = schema

    return obj
  }

  query(schema: any) {
    const obj = this.clone()
    obj._target.query = schema

    return obj
  }

  payload(schema: any) {
    const obj = this.clone()
    obj._target.payload = schema

    return obj
  }

  type(schema: any) {
    const obj = this.clone()
    obj._target.type = schema

    return obj
  }

  output(schema: any) {
    const obj = this.clone()
    obj._target.output = schema

    return obj
  }
}

const internal: Internal = {}

internal.root = function () {

  const any = new Any()

  const root = any.clone()

  return root
}

export default internal.root()