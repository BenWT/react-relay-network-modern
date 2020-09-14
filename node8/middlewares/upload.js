"use strict";

exports.__esModule = true;
exports.default = uploadMiddleware;

var _extractFiles = require("extract-files");

var _RelayRequestBatch = _interopRequireDefault(require("../RelayRequestBatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uploadMiddleware() {
  return next => async req => {
    if (req instanceof _RelayRequestBatch.default) {
      throw new Error('RelayRequestBatch is not supported');
    }

    const operations = {
      query: req.operation.text,
      variables: req.variables
    };
    const {
      clone: extractedOperations,
      files
    } = (0, _extractFiles.extractFiles)(operations);

    if (files.size) {
      const formData = new FormData();
      formData.append('operations', JSON.stringify(extractedOperations));
      const pathMap = {};
      let i = 0;
      files.forEach(paths => {
        pathMap[++i] = paths;
      });
      formData.append('map', JSON.stringify(pathMap));
      i = 0;
      files.forEach((paths, file) => {
        formData.append(++i, file, file.name);
      });
      req.fetchOpts.method = 'POST';
      req.fetchOpts.body = formData;
      delete req.fetchOpts.headers['Content-Type'];
    }

    const res = await next(req);
    return res;
  };
}