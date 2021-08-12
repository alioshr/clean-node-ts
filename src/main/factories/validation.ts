import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validator'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/helpers/validators/validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

const makeValidations = (validationFields: string[]): Validator[] => {
  const validations: Validator[] = []
  for (const field of validationFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const emailValidation = new EmailValidation(emailValidatorAdapter, 'email')
  validations.push(emailValidation)
  return validations
}

export const makeSignUpValidations = (): Validator => {
  return new ValidatorComposite(
    makeValidations(['email', 'password', 'confirmPassword', 'name'])
  )
}
