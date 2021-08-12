import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validator'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (fieldName: string): SutTypes => {
  const sut = new RequiredFieldValidation(fieldName)

  return { sut }
}

describe('Required Email Validator', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut('name')
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
    const { sut } = makeSut('email')
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
    const { sut } = makeSut('password')
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
    const { sut } = makeSut('confirmPassword')
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
