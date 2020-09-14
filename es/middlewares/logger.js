function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-console */
import RelayRequest from '../RelayRequest';
import RelayRequestBatch from '../RelayRequestBatch';
export default function loggerMiddleware(opts) {
  const logger = opts && opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  return next => req => {
    const start = new Date().getTime();
    logger(`Run ${req.getID()}`, req);
    return next(req).then(res => {
      const end = new Date().getTime();
      let queryId;
      let queryData;

      if (req instanceof RelayRequest) {
        queryId = req.getID();
        queryData = {
          query: req.getQueryString(),
          variables: req.getVariables()
        };
      } else if (req instanceof RelayRequestBatch) {
        queryId = req.getID();
        queryData = {
          requestList: req.requests,
          responseList: res.json
        };
      } else {
        queryId = 'CustomRequest';
        queryData = {};
      }

      logger(`Done ${queryId} in ${end - start}ms`, _objectSpread({}, queryData, {
        req,
        res
      }));

      if (res.status !== 200) {
        logger(`Status ${res.status}: ${res.statusText || ''} for ${queryId}`);
      }

      return res;
    }, error => {
      if (error && error.name && error.name === 'AbortError') {
        logger(`Cancelled ${req.getID()}`);
      }

      throw error;
    });
  };
}