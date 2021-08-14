import { MissingParamError } from '../../errors'
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '../../helpers/http/http-helper'
import { Validator } from '../../protocols'
import { LoginController } from './login'
import {
  HttpRequest,
  AuthResponseData,
  AuthAccount,
  AuthAccountModel,
  Controller
} from './login-protocols'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (data: any): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

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
  validatorStub: Validator
}

const makeSut = (): sutTypes => {
  const authAccountStub = makeAuthAccountStub()
  const validatorStub = makeValidatorStub()
  const sut = new LoginController(authAccountStub, validatorStub)

  return { sut, authAccountStub, validatorStub }
}

describe('Login Controller', () => {
  test('should call Validator with the proper params', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Sut should forward the same error returned by Validator if it throws', async () => {
    const { sut, validatorStub } = makeSut()
    const error = new MissingParamError('any_field')
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(error)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

  test('Should return a server error if authAccount throws', async () => {
    const { sut, authAccountStub } = makeSut()
    const error = new Error()
    jest.spyOn(authAccountStub, 'auth').mockImplementationOnce(() => {
      throw error
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(error))
  })

  test('authAccount should return proper auth data on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAuthAccount()))
  })

  test('Sut should return 401 if invalid credentials are passed', async () => {
    const { sut, authAccountStub } = makeSut()
    jest
      .spyOn(authAccountStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
