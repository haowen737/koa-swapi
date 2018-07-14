# koa-swapi


[![node](https://img.shields.io/node/v/passport.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)


> Super charged router for Koa

[English](https://github.com/haowen737/koa-swapi/blob/master/README.md) | [中文](https://github.com/haowen737/koa-swapi/blob/master/docs/README-zh.md)

*Koa-swapi* is a user-friendly Koa middleware, design your koa router with koa-swapi like [Hapijs](https://hapijs.com/), koa-swapi will validate each request components, and generate [OpenAPI](https://www.openapis.org/) documant (fka [Swagger](https://swagger.io/) RESTful API Documentation Specification).

## Install

```
npm i koa-swapi --save
```

## Usage Guide

Build Schema

```
const Joi = require('joi')
const { Route, Validator } = require('koa-swapi')

const catSchemas = [
    Route
        .get('/cat/:id')
        .tags(['catt', 'aninaml'])
        .summary('获得一只帅气猫')
        .description('想获得一只帅气猫的时候可以调用这个接口')
        .validate(
        Validator
            .params({
            id: Joi.string().required().min(2).max(4).description('猫的id')
            })
            .query({
            name: Joi.string().required().min(3).max(100).description('猫的名字'),
            sex: Joi.any().required().valid(['0', '1']).description('猫的性别, 0:男, 1:女')
            })
            .output({
            200: {
                body: Joi.string()
            }
            })
        )
        .create('getCat')
]

```

Build Controller

```
const controller = module.exports = {}

controller.getCat = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'miaomiaomiao'
}
```

Build Api

```
const { Api } = require('koa-swapi')

const apis = [
    Api.schemas(catSchemas).handler(catController)
]
```

Register

```
// app.js
const Koa = require('koa')
const { Swapi } = require('koa-swapi')

const app = new Koa()
const swapi = new Swapi()

swapi.register(app, {
    basePath: '/api',
    apis: apis
})

app.listen(3333)
```