"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingParamError = void 0;
const base_error_1 = require("./base-error");
class MissingParamError extends base_error_1.AppError {
    constructor(paramName) {
        super(`Missing param: ${paramName}`);
        this.name = 'MissingParamError';
    }
}
exports.MissingParamError = MissingParamError;
