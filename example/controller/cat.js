const controller = module.exports = {}

controller.get = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'miaomiaomiao'
}
