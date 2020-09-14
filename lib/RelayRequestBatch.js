"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _RRNLError = _interopRequireDefault(require("./RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RelayRequestBatch =
/*#__PURE__*/
function () {
  function RelayRequestBatch(requests) {
    _classCallCheck(this, RelayRequestBatch);

    this.requests = requests;
    this.fetchOpts = {
      method: 'POST',
      headers: {},
      body: this.prepareBody()
    };
  }

  _createClass(RelayRequestBatch, [{
    key: "setFetchOption",
    value: function setFetchOption(name, value) {
      this.fetchOpts[name] = value;
    }
  }, {
    key: "setFetchOptions",
    value: function setFetchOptions(opts) {
      this.fetchOpts = _objectSpread({}, this.fetchOpts, opts);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      if (!this.fetchOpts.body) {
        this.fetchOpts.body = this.prepareBody();
      }

      return this.fetchOpts.body || '';
    }
  }, {
    key: "prepareBody",
    value: function prepareBody() {
      return "[".concat(this.requests.map(function (r) {
        return r.getBody();
      }).join(','), "]");
    }
  }, {
    key: "getIds",
    value: function getIds() {
      return this.requests.map(function (r) {
        return r.getID();
      });
    }
  }, {
    key: "getID",
    value: function getID() {
      return "BATCH_REQUEST:".concat(this.getIds().join(':'));
    }
  }, {
    key: "isMutation",
    value: function isMutation() {
      return false;
    }
  }, {
    key: "isFormData",
    value: function isFormData() {
      return false;
    }
  }, {
    key: "clone",
    value: function clone() {
      // $FlowFixMe
      var newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
      newRequest.fetchOpts = _objectSpread({}, this.fetchOpts);
      newRequest.fetchOpts.headers = _objectSpread({}, this.fetchOpts.headers);
      return newRequest;
    }
  }, {
    key: "getVariables",
    value: function getVariables() {
      throw new _RRNLError["default"]('Batch request does not have variables.');
    }
  }, {
    key: "getQueryString",
    value: function getQueryString() {
      return this.prepareBody();
    }
  }]);

  return RelayRequestBatch;
}();

exports["default"] = RelayRequestBatch;