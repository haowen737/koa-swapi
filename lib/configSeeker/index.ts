import * as path from "path"
import * as fs from "fs"
import * as debug from "debug"

import swaggerDefault from './defaults/swagger'
import mockerDefault from './defaults/mocker'
import baseDefault from './defaults/base'

import { SwapiConfig } from '../interfaces/SwapiConfig.interface'

const PATH_APP = process.cwd()
const PATH_FILE = path.resolve(PATH_APP, "./swapi.json")
const DEBUG = debug("koapi:configSeeker")

class ConfigSeeker {
  public base = {}
  public swagger = {}
  public mocker = {}

  constructor(
    conf: SwapiConfig = {}
  ) {
    const {
      basePath,
      silence,
      swagger,
      mocker
    } = conf
    // this.swagger = this.meltSwagger({ swagger, basePath })
    // this.mocker = this.meltMocker({ mocker })
    // this.base = this.meltBase({ basePath, silence })
    this.swagger = this.meltSwagger(conf)
    this.mocker = this.meltMocker(conf)
    this.base = this.meltBase(conf)

  }

  meltSwagger (conf) {
    const { swagger, basePath } = conf
    return Object.assign({}, swaggerDefault, swagger, { basePath })
  }

  meltMocker (conf) {
    const { mocker } = conf
    return Object.assign({}, mockerDefault, mocker)
  }

  meltBase (conf) {
    const { basePath, silence } = conf
    return Object.assign({}, baseDefault, { basePath, silence })
  }

}

export default ConfigSeeker