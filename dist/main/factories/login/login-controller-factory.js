"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginController = void 0;
const db_auth_account_1 = require("../../../data/usecases/auth/db-auth-account");
const bcrypt_adapter_1 = require("../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter");
const jwt_adapter_1 = require("../../../infra/cryptography/jwt-adapter/jwt-adapter");
const account_mongo_repository_1 = require("../../../infra/db/mongodb/account/account-mongo-repository");
const log_mongo_repository_1 = require("../../../infra/db/mongodb/log/log-mongo-repository");
const login_controller_1 = require("../../../presentation/controllers/login/login-controller");
const log_controller_decorator_1 = require("../../decorators/log-controller-decorator");
const login_validation_factory_1 = require("./login-validation-factory");
const env_1 = __importDefault(require("../../config/env"));
const makeLoginController = () => {
    const accountRepository = new account_mongo_repository_1.AccountMongoRepository();
    const bcryptAdapter = new bcrypt_adapter_1.BCryptAdapter(12);
    const jwtAdapter = new jwt_adapter_1.JWTAdapter(env_1.default.jwtSecret);
    const authAccount = new db_auth_account_1.DbAuthAccount(accountRepository, bcryptAdapter, jwtAdapter, accountRepository);
    const logMongoRepository = new log_mongo_repository_1.LogMongoRepository();
    const loginController = new login_controller_1.LoginController(authAccount, login_validation_factory_1.makeLoginValidationComposite());
    return new log_controller_decorator_1.LoggerControllerDecorator(loginController, logMongoRepository);
};
exports.makeLoginController = makeLoginController;
