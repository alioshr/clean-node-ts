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
exports.DbAuthAccount = void 0;
class DbAuthAccount {
    constructor(loadAccount, decrypt, encrypter, updateAccessToken) {
        this.loadAccount = loadAccount;
        this.decrypt = decrypt;
        this.encrypter = encrypter;
        this.updateAccessToken = updateAccessToken;
    }
    auth(authData) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.loadAccount.load(authData.email);
            if (!account) {
                return null;
            }
            const isValid = yield this.decrypt.compare(authData.password, account.password);
            if (!isValid) {
                return null;
            }
            const token = this.encrypter.encrypt({
                name: account.name,
                id: account.id
            });
            yield this.updateAccessToken.updateToken({
                token: token,
                id: account.id
            });
            return { userId: account.id, token: token };
        });
    }
}
exports.DbAuthAccount = DbAuthAccount;
