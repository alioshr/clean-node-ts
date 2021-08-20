"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareFieldsValidation = void 0;
const errors_1 = require("../../errors");
class CompareFieldsValidation {
    constructor(fieldName, fieldToCompareName) {
        this.fieldName = fieldName;
        this.fieldToCompareName = fieldToCompareName;
    }
    validate(data) {
        if (data[this.fieldName] !== data[this.fieldToCompareName]) {
            return new errors_1.InvalidParamError(this.fieldToCompareName);
        }
        return null;
    }
}
exports.CompareFieldsValidation = CompareFieldsValidation;
