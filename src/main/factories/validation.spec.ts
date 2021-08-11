import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/helpers/validators/validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { makeSignUpValidations } from './validation'

jest.mock('../../presentation/helpers/validators/validator-composite')

const makeValidations = (
  validationFields: string[]
): Validator[] => {
  const validations: Validator[] = []
  for (const field of validationFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  return validations
}

interface SutTypes {
  sut: ValidatorComposite
  requiredFieldValidations: Validator[]
}

const makeSut = (): SutTypes => {
  const requiredFieldValidations = makeValidations([
    'name',
    'password',
    'confirmPassword',
    'email'
  ])
  const sut = new ValidatorComposite(requiredFieldValidations)
  return {
    sut,
    requiredFieldValidations
  }
}

describe('Validator Composite', () => {
  test('Should call ValidationComposite with all validations', () => {
    const { requiredFieldValidations } = makeSut()
    makeSignUpValidations()
    expect(ValidatorComposite).toHaveBeenCalledWith(requiredFieldValidations)
  })
  test.skip('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const error = await sut.validate(httpRequest.body)
    expect(error).toEqual(new MissingParamError('name'))
  })
  test.skip('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const httpResponse = await sut.validate(httpRequest.body)
    expect(httpResponse).toEqual(new MissingParamError('email'))
  })
  test.skip('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        confirmPassword: 'any'
      }
    }

    const httpResponse = await sut.validate(httpRequest.body)
    expect(httpResponse).toEqual(new MissingParamError('password'))
  })
  test.skip('should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        password: 'any'
      }
    }

    const httpResponse = await sut.validate(httpRequest.body)
    expect(httpResponse).toEqual(new MissingParamError('confirmPassword'))
  })
})
