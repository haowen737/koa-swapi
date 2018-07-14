interface Internal {
  build?
  melt?
}

interface Raw {
  method?: string
  path?: string
  id?: string
  tags?: string[]
  summary?: string
  description?: string
  validate?: string
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
  raw: Raw = {}
  path: string
  id: string

  clone() {
    const obj = Object.create(Object.getPrototypeOf(this))

    obj._path = this.raw.path
    obj._method = this.raw.method
    obj._tags = this.raw.tags
    obj._id = this.raw.id
    obj._summary = this.raw.summary
    obj._description = this.raw.description
    obj._validate = this.raw.validate

    obj.get = this.get
    obj.create = this.create
    obj.raw = this.raw
    obj.post = this.post
    obj.put = this.put
    obj.delete = this.delete
    obj.create = this.create
    obj.tags = this.tags
    obj.summary = this.summary
    obj.description = this.description
    obj.validate = this.validate

    obj._isSwapiRoute = true

    return obj
  }

  get = (path: string) => this.handlePath('get', path)

  post = (path: string) => this.handlePath('post', path)

  put = (path: string) => this.handlePath('put', path)

  delete = (path: string) => this.handlePath('delete', path)

  private handlePath (method: string, path: string) {
    this.raw.path = path
    this.raw.method = method
    return internal.melt.call(this)
  }

  create (id: string) {
    this.raw.id = id
    return internal.melt.call(this)
  }

  tags (tags: string[])
  tags (tags: string)
  tags (tags: any) {
    tags = tags instanceof Array
      ? tags
      : [tags]

    this.raw.tags = tags

    return internal.melt.call(this)
  }

  summary (summary: string) {
    this.raw.summary = summary

    return internal.melt.call(this)
  }

  description (description: string) {
    this.raw.description = description

    return internal.melt.call(this)
  }

  validate (joiSchema: any) {
    this.raw.validate = joiSchema

    return internal.melt.call(this)
  }

}


export default Builder()