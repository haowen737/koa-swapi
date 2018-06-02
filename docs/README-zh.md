# koa-swapi


[![node](https://img.shields.io/node/v/passport.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)


> 在Koa中使用更先进的路由

*Koa-swapi* 是一款用起来还算顺手的koa路由中间件, 你可以像 [Hapijs](https://hapijs.com/)一样定义路由, koa-swapi 会进行所有的请求参数校验, 并能生成 [OpenAPI](https://www.openapis.org/) 文档 ([Swagger](https://swagger.io/) RESTful API 文档说明).


## Install

    npm i koa-swapi --save

## Quick start

    // app.js
    const Koa = require('koa')
    const Swapi = require('koa-swapi')

    const app = new Koa()
    const swapi = new Swapi()

    swapi.register(app, {
      description: 'sweet swapi example',
      version: '1.0.0',
      title: 'swapii swagger example',
      basePath: '/v1'
    })

    app.listen(3333)

## Usage Guide

### JSON body
The most common API endpoint with HAPI.js is one that POST's a JSON body.

    {
      method: 'POST',
      path: '/items',
      config: {
          handler: (request, reply) => { reply('OK'); },
          tags: ['api'],
          validate: {
              payload: Joi.object({
                  a: Joi.number(),
                  b: Joi.number()
              })
          }
      }
    }

## 感谢

- [hapi](https://hapijs.com/) 路由即文档的一款node框架
- [Joi](https://github.com/hapijs/joi) 语义化的对象数据模式验证库
- [hapi-swagger](https://github.com/glennjones/hapi-swagger)hapi的一款swagger构建插件
- [Swagger UI](https://github.com/swagger-api/swagger-ui) 精美且强大的api接口文档管理平台