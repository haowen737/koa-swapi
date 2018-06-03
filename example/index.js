const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Swapi = require('../lib')
const router = require('koa-router')()
const routes = require('./routes')

const app = new Koa()
const swapi = new Swapi()

app.use(bodyparser())

// search api automatically
swapi.register(app, {
  basePath: '/v1',
})

// or directlly pass routes as parameter
// swapi.register(app, {
//   basePath: '/v1',
//   routes
// })

// feel free to use SPA or SSR
router.get('/', async (ctx, next) => {
  ctx.body = 'this is page'
});

app.use(router.routes())

app.listen(3333)

console.info('server is listening on port 3333')
