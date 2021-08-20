"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const base_error_1 = require("./base-error");
class ServerError extends base_error_1.AppError {
    constructor(stack) {
        super('Something went wrong');
        this.name = 'ServerError';
        this.stack = stack;
    }
}
exports.ServerError = ServerError;
