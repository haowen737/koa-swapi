const controller = module.exports = {}

controller.getCat = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'miaomiaomiao'
}
