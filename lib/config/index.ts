import * as path from "path"
import * as fs from "fs"
import * as debug from "debug"

import swaggerDefault from './defaults/swagger'
import mockerDefault from './defaults/mocker'

const PATH_APP = process.cwd()
const PATH_FILE = path.resolve(PATH_APP, "./swapi.json")
const DEBUG = debug("koapi:configSeeker")

class ConfigSeeker {
  public base
  public swagger
  public mocker

  private foo

  constructor() {
    if (!fs.existsSync(PATH_FILE)) { return }
    const raw = fs.readFileSync(PATH_FILE, 'utf8')
    try {
      this.foo = JSON.parse(raw)
    } catch (e) {
      throw new Error('damn!')
    }

    this.swagger = this.meltSwagger()
    this.mocker = this.meltMocker()
    this.base = this.meltBase()
  }

  meltSwagger () {
    const { swagger } = this.foo
    return Object.assign({}, swaggerDefault, swagger)
  }

  meltMocker () {
    const { mocker } = this.foo
    return Object.assign({}, mockerDefault, mocker)
  }

  meltBase () {
    const { basePath } = this.foo
    return Object.assign({}, { basePath })
  }

}

export default new ConfigSeeker()