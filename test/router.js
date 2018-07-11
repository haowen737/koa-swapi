const shoule = require('should')
const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')
const Joi = require('joi')

const { Swapi, api } = require('../built')

const apis = [
  api
    .schemas([{
      method: 'get',
      path: '/test/:id',
      config: {
        id: 'getTest',
        validate: {
          params: {
            id: Joi.string().required().min(2).max(4).description('猫的id')
          },
        }
      }
    }])
    .handler({ getTest: async (ctx) => {
      ctx.body = 'test ok'
    }})
]

describe('Router', function () {
  it('router can be accecced with ctx', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { printLog: false, apis })
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
    swapi.register(app, { printLog: false, apis })
    request(http.createServer(app.callback()))
      .get('/test/x')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.error.text).toMatch('child "id" fails')
        done()
      })
  })

  it('can compose middleware', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    const calls = []

    const m1 = (ctx, next) => {
      calls.push(1)
      return next().then(() => {
        calls.push(6)
      })
    }

    const m2 = (ctx, next) => {
      calls.push(2)
      return next().then(() => {
        calls.push(5)
      })
    }

    const m3 = (ctx, next) => {
      calls.push(3)
      return next().then(() => {
        calls.push(4)
      })
    }

    const middleware = [m1, m2, m3]

    swapi.register(app, { middleware, apis })

    request(http.createServer(app.callback()))
      .get('/test/xxx')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        calls.should.deepEqual([1, 2, 3, 4, 5, 6])
        done()
      })
  })

})