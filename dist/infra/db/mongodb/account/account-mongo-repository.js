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
exports.AccountMongoRepository = void 0;
const mongo_helper_1 = require("../helpers/mongo-helper");
class AccountMongoRepository {
    add(accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield mongo_helper_1.MongoHelper.getCollection('accounts');
            const result = yield collection.insertOne(accountData);
            const account = result.ops[0];
            return mongo_helper_1.MongoHelper.map(account);
        });
    }
    load(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield mongo_helper_1.MongoHelper.getCollection('accounts');
            const loadedAccount = yield collection.findOne({ email: email });
            if (loadedAccount) {
                return mongo_helper_1.MongoHelper.map(loadedAccount);
            }
            return null;
        });
    }
    updateToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield mongo_helper_1.MongoHelper.getCollection('accounts');
            yield collection.updateOne({ _id: data.id }, { $set: { token: data.token } });
        });
    }
}
exports.AccountMongoRepository = AccountMongoRepository;
