import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/helpers/validators/validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { makeSignUpValidations } from './validation'

// jest.mock('../../presentation/helpers/validators/validator-composite')

const makeValidations = (validationFields: string[]): Validator[] => {
  const validations: Validator[] = []
  for (const field of validationFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  return validations
}

interface SutTypes {
  sut: Validator
  requiredFieldValidations: Validator[]
}

const makeSut = (): SutTypes => {
  const requiredFieldValidations = makeValidations([
    'name',
    'password',
    'confirmPassword',
    'email'
  ])
  const sut = makeSignUpValidations()
  return {
    sut,
    requiredFieldValidations
  }
}

describe('Validator Composite', () => {
  test.skip('Should call ValidationComposite with all validations', async () => {
    const { requiredFieldValidations } = makeSut()
    expect(ValidatorComposite).toHaveBeenCalledWith(requiredFieldValidations)
  })
  test('should return 400 if password and confirmPassword do not match', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_mail@mail.com',
        password: 'any',
        confirmPassword: 'any1'
      }
    }

    const httpResponse = sut.validate(httpRequest.body)
    expect(httpResponse).toEqual(new InvalidParamError('confirmPassword'))
  })

  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }
    const error = sut.validate(httpRequest.body)

    expect(error).toEqual(new MissingParamError('name'))
  })
  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const error = sut.validate(httpRequest.body)

    expect(error).toEqual(new MissingParamError('email'))
  })
  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        confirmPassword: 'any'
      }
    }

    const error = sut.validate(httpRequest.body)
    expect(error).toEqual(new MissingParamError('password'))
  })
  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        password: 'any'
      }
    }

    const error = sut.validate(httpRequest.body)
    expect(error).toEqual(new MissingParamError('confirmPassword'))
  })
})
