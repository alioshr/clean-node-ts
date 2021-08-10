import { AuthResponseData } from '../../../domain/models/auth'
import {
  AuthAccount,
  AuthAccountModel
} from '../../../domain/usecases/auth-account'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any@email.com'
  }
})

const makeFakeAuthAccount = (): AuthResponseData => ({
  token: 'any_token',
  userId: 'any_user_id'
})

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthAccountStub = (): AuthAccount => {
  class AuthAccountStub implements AuthAccount {
    async auth (authData: AuthAccountModel): Promise<AuthResponseData> {
      return await new Promise((resolve) => resolve(makeFakeAuthAccount()))
    }
  }
  return new AuthAccountStub()
}
interface sutTypes {
  sut: Controller
  authAccountStub: AuthAccount
  emailValidatorStub: EmailValidator
}

const makeSut = (): sutTypes => {
  const authAccountStub = makeAuthAccountStub()
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new LoginController(authAccountStub, emailValidatorStub)

  return { sut, authAccountStub, emailValidatorStub }
}

describe('Login Controller', () => {
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'bla@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 200 if data is placed correctly', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(httpResponse.body))
  })

  test('Should call EmailValidator with the correct params', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(httpResponse.body))
  })

  test('Should call authAccount with correct params', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeHttpRequest())
    expect(emailValidatorSpy).toHaveBeenCalledWith(makeFakeHttpRequest().body.email)
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRespose = await sut.handle(makeFakeHttpRequest())
    expect(httpRespose).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return a server error if authAccount throws', async () => {
    const { sut, authAccountStub } = makeSut()
    const error = new Error()
    jest.spyOn(authAccountStub, 'auth').mockImplementationOnce(() => { throw error })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(error))
  })
})
