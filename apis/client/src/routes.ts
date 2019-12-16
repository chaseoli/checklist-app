/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { TestController } from './controller/test.controller';
import { HelperController } from './controller/helper.controller';
import { expressAuthentication } from './middleware/authentication';
import * as express from 'express';

const models: TsoaRoute.Models = {
};
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
  app.get('/test/msg',
    authenticateMiddleware([{ "api_key": [] }]),
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new TestController();


      const promise = controller.test.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/util/base64/encode-fb-cred',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new HelperController();


      const promise = controller.encodeFbCred.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/util/base64/decode-fb-cred',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new HelperController();


      const promise = controller.decodeFbCred.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/util/base64/encode',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new HelperController();


      const promise = controller.encodeBase64.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/util/base64/decode',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new HelperController();


      const promise = controller.decodeBase64.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/util/json/escape',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new HelperController();


      const promise = controller.escapeJson.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return (request: any, _response: any, next: any) => {
      let responded = 0;
      let success = false;

      const succeed = function(user: any) {
        if (!success) {
          success = true;
          responded++;
          request['user'] = user;
          next();
        }
      }

      const fail = function(error: any) {
        responded++;
        if (responded == security.length && !success) {
          error.status = 401;
          next(error)
        }
      }

      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          let promises: Promise<any>[] = [];

          for (const name in secMethod) {
            promises.push(expressAuthentication(request, name, secMethod[name]));
          }

          Promise.all(promises)
            .then((users) => { succeed(users[0]); })
            .catch(fail);
        } else {
          for (const name in secMethod) {
            expressAuthentication(request, name, secMethod[name])
              .then(succeed)
              .catch(fail);
          }
        }
      }
    }
  }

  function isController(object: any): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        if (isController(controllerObj)) {
          const headers = controllerObj.getHeaders();
          Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
          });

          statusCode = controllerObj.getStatus();
        }

        if (data || data === false) { // === false allows boolean result
          response.status(statusCode || 200).json(data);
        } else {
          response.status(statusCode || 204).end();
        }
      })
      .catch((error: any) => next(error));
  }

  function getValidatedArgs(args: any, request: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map((key) => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
        case 'path':
          return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
        case 'header':
          return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
        case 'body':
          return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
        case 'body-prop':
          return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
      }
    });
    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '');
    }
    return values;
  }
}
