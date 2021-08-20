"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const http_helper_1 = require("../../helpers/http/http-helper");
class LoginController {
    constructor(authAccount, validator) {
        this.authAccount = authAccount;
        this.validator = validator;
    }
    handle(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const error = this.validator.validate(httpRequest.body);
                if (error) {
                    return http_helper_1.badRequest(error);
                }
                const credentials = yield this.authAccount.auth(httpRequest.body);
                if (!credentials) {
                    return http_helper_1.unauthorized();
                }
                return http_helper_1.ok(credentials);
            }
            catch (error) {
                return http_helper_1.serverError(error);
            }
        });
    }
}
exports.LoginController = LoginController;
