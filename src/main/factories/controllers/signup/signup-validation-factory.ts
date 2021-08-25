import { ValidatorComposite, CompareFieldsValidation, EmailValidation, RequiredFieldValidation } from '../../../../presentation/helpers/validators'
import { Validator } from '../../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

const makeValidations = (): Validator[] => {
  const validations: Validator[] = []
  for (const field of ['email', 'password', 'confirmPassword', 'name']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const emailValidation = new EmailValidation(emailValidatorAdapter, 'email')
  validations.push(emailValidation)
  return validations
}

export const makeSignUpValidationComposite = (): Validator => {
  return new ValidatorComposite(
    makeValidations()
  )
}
