"use strict";

exports.__esModule = true;
exports.default = void 0;

var _RRNLError = _interopRequireDefault(require("./RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RelayRequestBatch {
  constructor(requests) {
    this.requests = requests;
    this.fetchOpts = {
      method: 'POST',
      headers: {},
      body: this.prepareBody()
    };
  }

  setFetchOption(name, value) {
    this.fetchOpts[name] = value;
  }

  setFetchOptions(opts) {
    this.fetchOpts = _objectSpread({}, this.fetchOpts, opts);
  }

  getBody() {
    if (!this.fetchOpts.body) {
      this.fetchOpts.body = this.prepareBody();
    }

    return this.fetchOpts.body || '';
  }

  prepareBody() {
    return `[${this.requests.map(r => r.getBody()).join(',')}]`;
  }

  getIds() {
    return this.requests.map(r => r.getID());
  }

  getID() {
    return `BATCH_REQUEST:${this.getIds().join(':')}`;
  }

  isMutation() {
    return false;
  }

  isFormData() {
    return false;
  }

  clone() {
    // $FlowFixMe
    const newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    newRequest.fetchOpts = _objectSpread({}, this.fetchOpts);
    newRequest.fetchOpts.headers = _objectSpread({}, this.fetchOpts.headers);
    return newRequest;
  }

  getVariables() {
    throw new _RRNLError.default('Batch request does not have variables.');
  }

  getQueryString() {
    return this.prepareBody();
  }

}

exports.default = RelayRequestBatch;