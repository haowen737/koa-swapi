const controller = module.exports = {}

controller.get = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'miaomiaomiao'
}
