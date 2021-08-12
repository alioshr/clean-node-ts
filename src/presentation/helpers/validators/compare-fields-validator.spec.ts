import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validator'

interface SutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation('password', 'confirmPassword')

  return { sut }
}

describe('CompareFieldsValidation', () => {
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
  test('Should return null if comparison succeeds', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const error = sut.validate(httpRequest.body)
    expect(error).toBe(null)
  })
})
