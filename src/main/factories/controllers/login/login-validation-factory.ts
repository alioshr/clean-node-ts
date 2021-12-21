import { EmailValidation, ValidatorComposite, RequiredFieldValidation } from '../../../../validation/validators'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

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

export const makeLoginValidationComposite = (): Validator => {
  return new ValidatorComposite(
    makeValidations()
  )
}
