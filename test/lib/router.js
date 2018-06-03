const shoule = require('should')
const Koa = require('koa')
const Swapi = require('../..')

describe('Router', function () {
  it('create new koa router', function () {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app)
  })
})