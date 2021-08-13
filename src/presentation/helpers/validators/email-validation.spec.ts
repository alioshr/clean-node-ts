import { InvalidParamError, ServerError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')

  return { sut, emailValidatorStub }
}

describe('EmailValidation', () => {
  test('should call EmailValidation with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any',
        email: 'correct_email@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    sut.validate(httpRequest.body)
    expect(emailValidatorSpy).toHaveBeenCalledWith('correct_email@mail.com')
  })
  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_mail',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const httpResponse = sut.validate(httpRequest.body)
    expect(httpResponse).toEqual(new InvalidParamError('email'))
  })
  test('should return null with valid email', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_mail@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }
    const httpResponse = sut.validate(httpRequest.body)
    expect(httpResponse).toEqual(null)
  })
  test('should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    const error = new Error()
    error.stack = 'error_stack'
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw error
    })
    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_mail@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const errorResponse = sut.validate(httpRequest.body)
    expect(errorResponse).toEqual(new ServerError('error_stack'))
  })
})
