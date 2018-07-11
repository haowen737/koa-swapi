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
      printLog,
      swagger,
      mocker
    } = conf
    this.swagger = this.meltSwagger({ swagger })
    this.mocker = this.meltMocker({ mocker })
    this.base = this.meltBase({ basePath, printLog })
  }

  meltSwagger ({ swagger }) {
    return Object.assign({}, swaggerDefault, swagger)
  }

  meltMocker ({ mocker }) {
    return Object.assign({}, mockerDefault, mocker)
  }

  meltBase ({ basePath, printLog }) {
    return Object.assign({}, baseDefault, { basePath, printLog })
  }

}

export default ConfigSeeker