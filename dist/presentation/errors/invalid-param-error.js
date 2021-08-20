"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidParamError = void 0;
const base_error_1 = require("./base-error");
class InvalidParamError extends base_error_1.AppError {
    constructor(paramName) {
        super(`Invalid param: ${paramName}`);
        this.name = 'InvalidParamError';
    }
}
exports.InvalidParamError = InvalidParamError;
