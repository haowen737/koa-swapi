import * as Hoek from 'hoek'

interface Target {
  method?: string
  path?: string
  id?: string
  tags?: string[]
  summary?: string
  description?: string
  validate?: string
}

interface Internal {
  root?
}

class Any {
  _isSwapiValidator: boolean
  _target: Target
  
  constructor() {
    this._isSwapiValidator = true
    this._target = {}
  }

  _init() {
    return this
  }

  clone() {
    const obj: any = Object.create(Object.getPrototypeOf(this))

    obj._isSwapiRoute = true
    obj._target = Hoek.clone(this._target)

    obj.get = this.get
    obj.post = this.post
    obj.put = this.put
    obj.delete = this.delete
    obj.create = this.create
    obj.tags = this.tags
    obj.summary = this.summary
    obj.description = this.description
    obj.validate = this.validate

    return obj
  }

  get = (path: string) => this.handlePath('get', path)

  post = (path: string) => this.handlePath('post', path)

  put = (path: string) => this.handlePath('put', path)

  delete = (path: string) => this.handlePath('delete', path)

  private handlePath (method: string, path: string) {
    const obj = this.clone()
    obj._target.path = path
    obj._target.method = method

    return obj
  }

  create (id: string) {
    const obj = this.clone()
    obj._target.id = id

    return obj
  }

  tags (tags: string[])
  tags (tags: string)
  tags (tags: any) {
    const obj = this.clone()
    tags = tags instanceof Array
      ? tags
      : [tags]

    obj._target.tags = tags

    return obj
  }

  summary (summary: string) {
    const obj = this.clone()
    obj._target.summary = summary

    return obj
  }

  description (description: string) {
    const obj = this.clone()
    obj._target.description = description

    return obj
  }

  validate (joiSchema: any) {
    const obj = this.clone()
    obj._target.validate = joiSchema

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