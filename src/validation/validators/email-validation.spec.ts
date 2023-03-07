import { InvalidParamError } from '../../presentation/errors'
import { type EmailValidator } from '../protocols/emailValidator'
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

    const data = {
      email: 'correct_email@mail.com'
    }

    sut.validate(data)
    expect(emailValidatorSpy).toHaveBeenCalledWith('correct_email@mail.com')
  })
  test('should return an invalid param error if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const data = {
      email: 'invalid_mail'
    }

    const error = sut.validate(data)
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('should return null with valid email', () => {
    const { sut } = makeSut()

    const data = {
      email: 'invalid_mail@mail.com'
    }

    const error = sut.validate(data)
    expect(error).toEqual(null)
  })
  test('should throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
