import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AuthAccount,
  AuthAccountModel,
  AuthResponseData
} from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { HttpRequest } from '../../protocols'
import { Validator } from '../../protocols/validator'

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
    name: 'any',
    email: 'bla@mail.com',
    password: 'any',
    confirmPassword: 'any'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

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

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validatorStub: Validator
  authAccountStub: AuthAccount

}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidatorStub()
  const authAccountStub = makeAuthAccountStub()
  const sut = new SignUpController(
    addAccountStub,
    validatorStub,
    authAccountStub
  )
  return {
    sut,
    addAccountStub,
    validatorStub,
    authAccountStub
  }
}

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('should call add with the proper params', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })
  test('should return a serverError if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const error = new Error()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(error))
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(error))
  })

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
    jest
      .spyOn(validatorStub, 'validate')
      .mockReturnValueOnce(error)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })
  test('Should call auth with the correct params', async () => {
    const { sut, authAccountStub } = makeSut()
    const { email, password } = makeFakeHttpRequest().body
    const authSpy = jest.spyOn(authAccountStub, 'auth')
    await sut.handle(makeFakeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({ email, password })
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
  test('should return an AuthAccountModel on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAuthAccount()))
  })
})
