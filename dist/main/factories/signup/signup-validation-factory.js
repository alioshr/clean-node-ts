"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignUpValidationComposite = void 0;
const validators_1 = require("../../../presentation/helpers/validators");
const email_validator_adapter_1 = require("../../adapters/validators/email-validator-adapter");
const makeValidations = () => {
    const validations = [];
    for (const field of ['email', 'password', 'confirmPassword', 'name']) {
        validations.push(new validators_1.RequiredFieldValidation(field));
    }
    validations.push(new validators_1.CompareFieldsValidation('password', 'confirmPassword'));
    const emailValidatorAdapter = new email_validator_adapter_1.EmailValidatorAdapter();
    const emailValidation = new validators_1.EmailValidation(emailValidatorAdapter, 'email');
    validations.push(emailValidation);
    return validations;
};
const makeSignUpValidationComposite = () => {
    return new validators_1.ValidatorComposite(makeValidations());
};
exports.makeSignUpValidationComposite = makeSignUpValidationComposite;
