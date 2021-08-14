import { EmailValidation, ValidatorComposite, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validator } from '../../../presentation/protocols'
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
