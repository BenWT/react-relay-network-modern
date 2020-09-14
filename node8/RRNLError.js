"use strict";

exports.__esModule = true;
exports.default = void 0;

class RRNLError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'RRNLError';
  }

}

exports.default = RRNLError;