import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validator'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/protocols/validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { makeSignUpValidations } from './validation'
import { EmailValidator } from '../../presentation/protocols/emailValidator'

jest.mock('../../presentation/helpers/validators/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeValidations = (validationFields: string[]): Validator[] => {
  const validations: Validator[] = []
  for (const field of validationFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
  const emailValidatorAdapter = makeEmailValidator()
  const emailValidation = new EmailValidation(emailValidatorAdapter, 'email')
  validations.push(emailValidation)

  return validations
}
const requiredFieldValidations = makeValidations([
  'email',
  'password',
  'confirmPassword',
  'name'
])

describe('Validator Composite', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidations()
    expect(ValidatorComposite).toHaveBeenCalledWith(requiredFieldValidations)
  })
})
