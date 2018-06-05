const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')

const Swapi = require('..')

const routes = [{
  method: 'get',
  path: '/test/:id',
  config: {
    handler: (ctx) => {
      ctx.body = 'test ok'
    }
  }
}]

describe('Swagger', function () {
  it ('swagger json built succeesfully', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { routes })
    request(http.createServer(app.callback()))
      .get('/swagger.json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('swagger documentation can be accessed', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { routes })
    request(http.createServer(app.callback()))
      .get('/documentation/')
      .expect(200, done)
  })
})