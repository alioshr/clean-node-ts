import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/helpers/validators/validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'

const makeValidations = (validationFields: string[]): Validator[] => {
  const validations: Validator[] = []
  for (const field of validationFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  return validations
}

export const makeSignUpValidations = (): Validator => {
  return new ValidatorComposite(
    makeValidations(['email', 'password', 'confirmPassword', 'name'])
  )
}
