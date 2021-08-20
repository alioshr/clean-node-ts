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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoHelper = void 0;
const mongodb_1 = require("mongodb");
exports.MongoHelper = {
    client: null,
    uri: null,
    connect(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            this.uri = uri;
            this.client = yield mongodb_1.MongoClient.connect(uri, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        });
    },
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
            this.client = null;
        });
    },
    getCollection(name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.isConnected())) {
                yield this.connect(this.uri);
            }
            return this.client.db().collection(name);
        });
    },
    map: (collectionElement) => {
        const { _id } = collectionElement, collectionElementWithoutId = __rest(collectionElement, ["_id"]);
        return Object.assign({}, collectionElementWithoutId, { id: _id });
    }
};
