"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_route_adapter_1 = require("../adapters/express/express-route-adapter");
const login_controller_factory_1 = require("../factories/login/login-controller-factory");
const signup_controller_factory_1 = require("../factories/signup/signup-controller-factory");
exports.default = (router) => {
    router.post('/login', express_route_adapter_1.adaptRoute(login_controller_factory_1.makeLoginController()));
    router.post('/signup', express_route_adapter_1.adaptRoute(signup_controller_factory_1.makeSignUpController()));
};
