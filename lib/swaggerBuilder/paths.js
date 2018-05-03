const Hoek = require('hoek')
const Joi = require('joi')

const Parameters = require('./parameters')

const internals = {}

class Paths {
  constructor(
    settings
  ) {
    this.settings = settings
    // this.definitions = new Definitions(settings);
    // this.properties = new Properties(settings, {}, {});
    // this.responses = new Responses(settings, {}, {});


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
      routesRaw.push(routeRaw)
    }
    return this.buildRoutes(routesRaw)
  }

  buildRoutes(routesRaw) {
    let pathObj = {}

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

      // let pathParam = this._getPathParam(raw)
      const {
        pathParams,
        queryParams,
        payloadParams
      } = Parameters.build(raw)

      // let pathStructures = this.getDefaultStructures();
      // let pathJoi = internals.getJOIObj(route, 'pathParams');
      // pathStructures = this.getSwaggerStructures(pathJoi, 'path', false, false);

      out.parameters = out.parameters.concat(
        pathParams,
        queryParams,
        payloadParams
      )
      pathObj[path] = pathObj[path] || {}
      pathObj[path][method.toLowerCase()] = out
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
  };


}

internals.getJOIObj = function (route, name) {

  let prama = route[name];
  //  if (Utilities.hasJoiChildren(route[name])) {
  //      prama = route[name]._inner.children;
  //  }
  return prama;
};

module.exports = Paths
