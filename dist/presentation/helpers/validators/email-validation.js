"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidation = void 0;
const errors_1 = require("../../errors");
class EmailValidation {
    constructor(emailValidator, fieldName) {
        this.emailValidator = emailValidator;
        this.fieldName = fieldName;
    }
    validate(data) {
        const isValidMail = this.emailValidator.isValid(data[this.fieldName]);
        if (!isValidMail) {
            return new errors_1.InvalidParamError(this.fieldName);
        }
        return null;
    }
}
exports.EmailValidation = EmailValidation;
