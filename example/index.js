const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Sqrl = require('squirrelly')
const router = require('koa-router')()
const routes = require('./routes')
const { Swapi } = require('../built')
const myTemplate = require('./views')

const app = new Koa()
const swapi = new Swapi()

app.use(bodyparser())

// search api automatically
// swapi.register(app)

// or directlly pass routes as parameter
swapi.register(app, {
  basePath: '/api',
  apis: routes,
})

// feel free to use SPA or SSR
router.get('/', async (ctx, next) => {
  ctx.body = Sqrl.Render(myTemplate, {
    SwaggerDoc: '/documentation'
  })
});

app.use(router.routes())

app.listen(3333)

console.info('server is listening on port 3333')
