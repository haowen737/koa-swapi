const Hoek = require('hoek')
const Joi = require('joi')

const Parameters = require('./parameters')
const Properties = require('./properties');
const Responses = require('./responses');
const Utilities = require('./utilities');

const internals = {}

class Paths {
  constructor(
    settings
  ) {
    this.settings = settings
    // this.definitions = new Definitions(settings);
    this.properties = new Properties(settings, {}, {});
    this.responses = new Responses(settings, {}, {});


    this.defaults = {
      responses: {}
    }

    this.schema = Joi.object({
      tags: Joi.array().items(Joi.string()),
      summary: Joi.string(),
      description: Joi.string(),
      externalDocs: Joi.object({
        description: Joi.string(),
        url: Joi.string().uri()
      }),
      operationId: Joi.string(),
      consumes: Joi.array().items(Joi.string()),
      produces: Joi.array().items(Joi.string()),
      parameters: Joi.array().items(Joi.object()),
      responses: Joi.object().required(),
      schemes: Joi.array().items(Joi.string().valid(['http', 'https', 'ws', 'wss'])),
      deprecated: Joi.boolean(),
      security: Joi.array().items(Joi.object())
    })
  }

  build(routes) {
    const routesRaw = []

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const routeRaw = {
        path: route.path,
        method: route.method.toUpperCase(),
        description: route.description,
        summary: route.summary,
        tags: Hoek.reach(route, 'tags'),
        queryParams: Hoek.reach(route, 'validate.query'),
        pathParams: Hoek.reach(route, 'validate.params'),
        payloadParams: Hoek.reach(route, 'validate.payload'),
        responseSchema: Hoek.reach(route, 'response.schema'),
        responseStatus: Hoek.reach(route, 'response.status'),
        headerParams: Hoek.reach(route, 'validate.headers'),
        consumes: Hoek.reach(route, 'options.consumes') || null,
        produces: Hoek.reach(route, 'options.produces') || null,
        responses: Hoek.reach(route, 'options.responses') || null,
        payloadType: Hoek.reach(route, 'options.payloadType') || null,
        security: Hoek.reach(route, 'options.security') || null,
        order: Hoek.reach(route, 'options.order') || null,
        deprecated: Hoek.reach(route, 'options.deprecated') || null,
        id: Hoek.reach(route, 'options.id') || null,
        groups: route.group,
        'x-meta': Hoek.reach(route, 'options.x-meta') || null
      }

      // user configured interface through route plugin options
      if (Hoek.reach(route, 'validate.query')) {
        routeRaw.queryParams = Utilities.toJoiObject(Hoek.reach(route, 'validate.query'));
      }
      if (Hoek.reach(route, 'validate.params')) {
        routeRaw.pathParams = Utilities.toJoiObject(Hoek.reach(route, 'validate.params'));
      }
      if (Hoek.reach(route, 'validate.headers')) {
        routeRaw.headerParams = Utilities.toJoiObject(Hoek.reach(route, 'validate.headers'));
      }
      if (Hoek.reach(route, 'validate.payload')) {
        // has different structure, just pass straight through
        routeRaw.payloadParams = Hoek.reach(route, 'validate.payload');
        // if its a native javascript object convert it to JOI
        if (!routeRaw.payloadParams.isJoi) {
          routeRaw.payloadParams = Joi.object(routeRaw.payloadParams);
        }
      }

      routesRaw.push(routeRaw)
    }
    return this.buildRoutes(routesRaw)
  }

  buildRoutes(routesRaw) {
    let pathObj = {}
    // let swagger = {
    //   'definitions': {},
    //   'x-alt-definitions': {}
    // };
    for (let i = 0; i < routesRaw.length; i++) {
      const raw = routesRaw[i]

      let method = raw.method
      let path = raw.path
      let out = {
        summary: raw.summary,
        tags: raw.tags,
        operationId: raw.id,
        description: raw.description,
        parameters: [],
        consumes: [],
        produces: []
      }

      let payloadType = internals.overload(this.settings.payloadType, raw.payloadType);
      let payloadStructures = this.getDefaultStructures();
      let payloadJoi = internals.getJOIObj(raw, 'payloadParams');
      if (payloadType.toLowerCase() === 'json') {
        // set as json
        payloadStructures = this.getSwaggerStructures(payloadJoi, 'body', true, false);
      } else {
        // set as formData
        if (Utilities.hasJoiChildren(payloadJoi)) {
          payloadStructures = this.getSwaggerStructures(payloadJoi, 'formData', false, false);
        } else {
          this.testParameterError(payloadJoi, 'payload form-urlencoded', path);
        }
        // add form data mimetype
        out.consumes = ['application/x-www-form-urlencoded'];
      }



      let pathStructures = this.getDefaultStructures();
      let pathJoi = internals.getJOIObj(raw, 'pathParams');
      // console.log('pathStructures------', Utilities.hasJoiChildren(pathJoi))
      if (Utilities.hasJoiChildren(pathJoi)) {
        pathStructures = this.getSwaggerStructures(pathJoi, 'path', false, false);
        pathStructures.parameters.forEach(function (item) {

          // add required based on path pattern {prama} and {prama?}
          if (item.required === undefined) {
            if (path.indexOf('{' + item.name + '}') > -1) {
              item.required = true;
            }
            if (path.indexOf('{' + item.name + '?}') > -1) {
              delete item.required;
            }
          }
          if (item.required === false) {
            delete item.required;
          }
          if (!item.required) {
            // TODO: settings.log暂时移除
            // this.settings.log(['validation', 'warning'], 'The ' + path + ' params parameter {' + item.name + '} is set as optional. This will work in the UI, but is invalid in the swagger spec');
          }

        });
      } else {
        this.testParameterError(pathJoi, 'params', path);
      }



      //let headerParams = this.properties.toParameters (internals.getJOIObj(route, 'headerParams'), 'header', false);
      let headerStructures = this.getDefaultStructures();
      let headerJoi = internals.getJOIObj(raw, 'headerParams');
      if (Utilities.hasJoiChildren(headerJoi)) {
        headerStructures = this.getSwaggerStructures(headerJoi, 'header', false, false);
      } else {
        this.testParameterError(headerJoi, 'headers', path);
      }
      // if the API has a user set accept header with a enum convert into the produces array
      if (this.settings.acceptToProduce === true) {
        headerStructures.parameters = headerStructures.parameters.filter(function (header) {

          if (header.name.toLowerCase() === 'accept') {
            if (header.enum) {
              out.produces = Utilities.sortFirstItem(header.enum, header.default);
              return false;
            }
          }
          return true;
        });
      }


      let queryStructures = this.getDefaultStructures();
      let queryJoi = internals.getJOIObj(raw, 'queryParams');
      if (Utilities.hasJoiChildren(queryJoi)) {
        queryStructures = this.getSwaggerStructures(queryJoi, 'query', false, false);
      } else {
        this.testParameterError(queryJoi, 'query', path);
      }


      out.parameters = out.parameters.concat(
        headerStructures.parameters,
        pathStructures.parameters,
        queryStructures.parameters,
        payloadStructures.parameters
      );


      // if the api sets the content-type header pramater use that
      if (internals.hasContentTypeHeader(out)) {
        delete out.consumes;
      }

      //let name = out.operationId + method;
      //userDefindedSchemas, defaultSchema, statusSchemas, useDefinitions, isAlt
      out.responses = this.responses.build(
        raw.responses,
        raw.responseSchema,
        raw.responseStatus,
        true,
        false
      );


      if (raw.order) {
        out['x-order'] = raw.order;
      }
      if (raw['x-meta']) {
        out['x-meta'] = raw['x-meta'];
      }
      if (raw.deprecated !== null) {
        out.deprecated = raw.deprecated;
      }

      if (!pathObj[path]) {
        pathObj[path] = {};
      }
      pathObj[path][method.toLowerCase()] = Utilities.deleteEmptyProperties(out);

    }

    return pathObj
  }
  _getPathParam(route) {
    const schema = route.pathParams
    const outParam = schema
      ? this._getSwaggerStructures(schema)
      : {}
    return {}
  }

  getDefaultStructures() {
    return {
      'properties': {},
      'parameters': []
    }
  }

  getSwaggerStructures(joiObj, parameterType, useDefinitions, isAlt) {

    let outProperties;
    let outParameters;

    if (joiObj) {
      // name, joiObj, parent, parameterType, useDefinitions, isAlt
      outProperties = this.properties.parseProperty(null, joiObj, null, parameterType, useDefinitions, isAlt);
      outParameters = Parameters.fromProperties(outProperties, parameterType);
    }
    let out = {
      properties: outProperties || {},
      parameters: outParameters || []
    };
    return out;
  }

  testParameterError (joiObj, parameterType, path) {

    if (joiObj && !Utilities.hasJoiChildren(joiObj)) {
            // TODO: settings.log暂时移除
      // this.settings.log(['validation', 'error'], 'The ' + path + ' route ' + parameterType + ' parameter was set, but not as a Joi.object() with child properties');
    }
  };


}

internals.getJOIObj = function (route, name) {

  let prama = route[name];
  //  if (Utilities.hasJoiChildren(route[name])) {
  //      prama = route[name]._inner.children;
  //  }
  return prama;
};

/**
 * does path parameters have a content-type header
 *
 * @param  {String} path
 * @return {boolean}
 */
internals.hasContentTypeHeader = function (path) {

  let out = false;
  path.parameters.forEach(function (prama) {

    if (prama.in === 'header' && prama.name.toLowerCase() === 'content-type') {
      out = true;
    }
  });
  return out;
};

/**
 * overload one object with another
 *
 * @param  {Object} base
 * @param  {Object} priority
 * @return {Object}
 */
internals.overload = function (base, priority) {

  return (priority) ? priority : base;
};

module.exports = Paths
