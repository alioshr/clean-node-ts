import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validator'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/protocols/validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { makeSignUpValidations } from './validation'

jest.mock('../../presentation/helpers/validators/validator-composite')

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
