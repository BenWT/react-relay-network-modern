"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockReq = mockReq;
exports.mockMutationReq = mockMutationReq;
exports.mockFormDataReq = mockFormDataReq;
exports.mockReqWithSize = mockReqWithSize;
exports.mockReqWithFiles = mockReqWithFiles;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable import/prefer-default-export, no-param-reassign */
var MockReq =
/*#__PURE__*/
function () {
  function MockReq(reqid) {
    var reqData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MockReq);

    this.reqid = reqid || Math.random().toString();
    this.reqData = reqData;
  }

  _createClass(MockReq, [{
    key: "getID",
    value: function getID() {
      return this.reqid;
    }
  }, {
    key: "getQueryString",
    value: function getQueryString() {
      return this.reqData.query || '';
    }
  }, {
    key: "getDebugName",
    value: function getDebugName() {
      return "debugname".concat(this.reqid);
    }
  }, {
    key: "getVariables",
    value: function getVariables() {
      return this.reqData.variables || {};
    }
  }, {
    key: "getFiles",
    value: function getFiles() {
      return this.reqData.files;
    }
  }, {
    key: "reject",
    value: function reject(err) {
      this.error = err;
    }
  }, {
    key: "resolve",
    value: function resolve(resp) {
      this.payload = resp;
    }
  }, {
    key: "execute",
    value: function execute(rnl) {
      var text = this.getQueryString() || '';
      var operationKind = text.startsWith('mutation') ? 'mutation' : 'query';
      var operation = {
        id: this.getID(),
        text: text,
        operationKind: operationKind
      };
      var variables = this.getVariables() || {};
      var cacheConfig = this.reqData.cacheConfig || {};
      var uploadables = this.getFiles();
      var res = rnl.fetchFn(operation, variables, cacheConfig, uploadables);
      var promise = new Promise(function (resolve, reject) {
        res.subscribe({
          complete: function complete() {},
          error: function error(_error) {
            return reject(_error);
          },
          next: function next(value) {
            return resolve(value);
          }
        });
      }); // avoid unhandled rejection in tests

      promise["catch"](function () {}); // but allow to read rejected response

      return promise;
    }
  }]);

  return MockReq;
}();

function mockReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, data);
}

function mockMutationReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, _objectSpread({
    query: 'mutation {}'
  }, data));
}

function mockFormDataReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, _objectSpread({
    files: {
      file1: 'data'
    }
  }, data));
}

function mockReqWithSize(reqid, size) {
  return mockReq(reqid, {
    query: "{".concat('x'.repeat(size), "}")
  });
}

function mockReqWithFiles(reqid) {
  return mockReq(reqid, {
    files: {
      file1: 'data',
      file2: 'data'
    }
  });
}