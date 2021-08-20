"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTAdapter {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }
    encrypt(data) {
        const token = jsonwebtoken_1.default.sign(data, this.secretKey);
        return token;
    }
}
exports.JWTAdapter = JWTAdapter;
