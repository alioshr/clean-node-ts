import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidatorComposite } from '../../../../validation/validators'
import { EmailValidator } from '../../../../validation/protocols/emailValidator'
import { makeSignUpValidationComposite } from './signup-validation-factory'
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
  for (const field of [
    'email',
    'password',
    'confirmPassword',
    'name'
  ]) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
  const emailValidatorAdapter = makeEmailValidator()
  const emailValidation = new EmailValidation(emailValidatorAdapter, 'email')
  validations.push(emailValidation)

  return validations
}
const requiredFieldValidations = makeValidations()

describe('SignUp Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidationComposite()
    expect(ValidatorComposite).toHaveBeenCalledWith(requiredFieldValidations)
  })
})
