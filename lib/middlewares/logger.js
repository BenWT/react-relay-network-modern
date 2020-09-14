"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loggerMiddleware;

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RelayRequestBatch = _interopRequireDefault(require("../RelayRequestBatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function loggerMiddleware(opts) {
  var logger = opts && opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  return function (next) {
    return function (req) {
      var start = new Date().getTime();
      logger("Run ".concat(req.getID()), req);
      return next(req).then(function (res) {
        var end = new Date().getTime();
        var queryId;
        var queryData;

        if (req instanceof _RelayRequest["default"]) {
          queryId = req.getID();
          queryData = {
            query: req.getQueryString(),
            variables: req.getVariables()
          };
        } else if (req instanceof _RelayRequestBatch["default"]) {
          queryId = req.getID();
          queryData = {
            requestList: req.requests,
            responseList: res.json
          };
        } else {
          queryId = 'CustomRequest';
          queryData = {};
        }

        logger("Done ".concat(queryId, " in ").concat(end - start, "ms"), _objectSpread({}, queryData, {
          req: req,
          res: res
        }));

        if (res.status !== 200) {
          logger("Status ".concat(res.status, ": ").concat(res.statusText || '', " for ").concat(queryId));
        }

        return res;
      }, function (error) {
        if (error && error.name && error.name === 'AbortError') {
          logger("Cancelled ".concat(req.getID()));
        }

        throw error;
      });
    };
  };
}