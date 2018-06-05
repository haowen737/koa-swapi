const shoule = require('should')
const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')
const Joi = require('joi')

const Swapi = require('..')

const routes = [{
  method: 'get',
  path: '/test/:id',
  config: {
    validate: {
      params: {
        id: Joi.string().required().min(2).max(4).description('猫的id')
      },
    },
    handler: (ctx) => {
      ctx.body = 'test ok'
    }
  }
}]

describe('Router', function () {
  it('router can be accecced with ctx', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { routes })
    request(http.createServer(app.callback()))
      .get('/test/xxx')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.text).toMatch('test ok')
        done()
      })
  })

  it('can validate params', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { routes })
    request(http.createServer(app.callback()))
      .get('/test/x')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.error.text).toMatch('child "id" fails')
        done()
      })
  })

})