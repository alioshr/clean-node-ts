"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Middlewares_1 = require("../Middlewares");
exports.default = (app) => {
    app.use(Middlewares_1.bodyParser);
    app.use(Middlewares_1.cors);
    app.use(Middlewares_1.contentType);
};
