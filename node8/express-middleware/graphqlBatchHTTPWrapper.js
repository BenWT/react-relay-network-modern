"use strict";

exports.__esModule = true;
exports.default = _default;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default(graphqlHTTPMiddleware) {
  return (req, res) => {
    const subResponses = [];
    return Promise.all(req.body.map(data => new Promise(resolve => {
      const subRequest = _objectSpread({
        __proto__: req.__proto__
      }, req, {
        body: data
      });

      const subResponse = _objectSpread({}, res, {
        status(st) {
          this.statusCode = st;
          return this;
        },

        set() {
          return this;
        },

        send(payload) {
          resolve({
            status: this.statusCode,
            id: data.id,
            payload
          });
        },

        // support express-graphql@0.5.2
        setHeader() {
          return this;
        },

        header() {},

        write(payload) {
          this.payload = payload;
        },

        end(payload) {
          // support express-graphql@0.5.4
          if (payload) {
            this.payload = payload;
          }

          resolve({
            status: this.statusCode,
            id: data.id,
            payload: this.payload
          });
        }

      });

      subResponses.push(subResponse);
      graphqlHTTPMiddleware(subRequest, subResponse);
    }))).then(responses => {
      let response = '';
      responses.forEach(({
        status,
        id,
        payload
      }, idx) => {
        if (status) {
          res.status(status);
        }

        const comma = responses.length - 1 > idx ? ',' : '';
        response += `{ "id":"${id}", "payload":${payload} }${comma}`;
      });
      res.set('Content-Type', 'application/json');
      res.send(`[${response}]`);
    }).catch(err => {
      res.status(500).send({
        error: err.message
      });
    });
  };
}