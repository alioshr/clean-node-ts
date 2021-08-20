"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorComposite = void 0;
class ValidatorComposite {
    constructor(validations) {
        this.validations = validations;
    }
    validate(data) {
        for (const validation of this.validations) {
            const error = validation.validate(data);
            if (error !== null) {
                return error;
            }
        }
        return null;
    }
}
exports.ValidatorComposite = ValidatorComposite;
