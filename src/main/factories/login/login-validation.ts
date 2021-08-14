import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../../presentation/protocols/validator'
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

const makeValidations = (): Validator[] => {
  const validations: Validator[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const emailValidation = new EmailValidation(emailValidatorAdapter, 'email')
  validations.push(emailValidation)
  return validations
}

export const makeLoginValidations = (): Validator => {
  return new ValidatorComposite(
    makeValidations()
  )
}
