import { EmailValidation, ValidatorComposite, RequiredFieldValidation } from '../../../../validation/validators'
import { EmailValidator } from '../../../../validation/protocols/emailValidator'
import { makeLoginValidationComposite } from './login-validation-factory'
import { Validator } from '../../../../presentation/protocols'

jest.mock('../../../../validation/validators/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeValidations = (): Validator[] => {
  const validations: Validator[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const emailValidatorAdapter = makeEmailValidator()
  const emailValidation = new EmailValidation(emailValidatorAdapter, 'email')
  validations.push(emailValidation)

  return validations
}
const requiredFieldValidations = makeValidations()

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidationComposite()
    expect(ValidatorComposite).toHaveBeenCalledWith(requiredFieldValidations)
  })
})
