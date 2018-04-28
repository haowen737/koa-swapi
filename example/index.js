const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Koapi = require('../lib/koapii')

const koapi = new Koapi()
const app = new Koa()

koapi.register(app)
// api.buildSwagger()

app.use(bodyparser())

app.listen(3333)

console.info('server is listening on port 3333')
