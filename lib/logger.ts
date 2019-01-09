import { createLogger, format, transports } from "winston"

const { combine, timestamp, label, printf } = format
const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})
const swapiLogger = createLogger({
  format: combine(
    label({ label: 'SWAPI' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
})

export default class SwapiLogger {
  private useUserLooger: boolean
  private innerLogger: any

  constructor(userLogger: any) {
    this.useUserLooger = !!userLogger
    this.innerLogger = userLogger || swapiLogger
    this.info(`using ${this.useUserLooger ? 'custom' : 'swapi'} logger instance`)
    return this
  }
  public error(msg: string) {
    const message = this.wrapMsg(msg)
    return this.innerLogger.error(message)
  } 
  public warn(msg: string) {
    const message = this.wrapMsg(msg)
    return this.innerLogger.warn(message)
  } 
  public info(msg: string) {
    const message = this.wrapMsg(msg)
    return this.innerLogger.info(message)
  } 
  public verbose(msg: string) {
    const message = this.wrapMsg(msg)
    return this.innerLogger.verbose(message)
  } 
  public debug(msg: string) {
    const message = this.wrapMsg(msg)
    return this.innerLogger.debug(message)
  } 
  public silly(msg: string) {
    const message = this.wrapMsg(msg)
    return this.innerLogger.silly(message)
  }
  private wrapMsg(msg: string) {
    return this.useUserLooger
      ? `[SWAPI] ${msg}`
      : msg 
  }
}
