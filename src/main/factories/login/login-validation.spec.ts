import { EmailValidation, ValidatorComposite, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validator, EmailValidator } from '../../../presentation/protocols'
import { makeLoginValidations } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validator-composite')

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
    makeLoginValidations()
    expect(ValidatorComposite).toHaveBeenCalledWith(requiredFieldValidations)
  })
})
