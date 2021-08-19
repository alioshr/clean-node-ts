import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import {
  AddAccount,
  AddAccountModel,
  AccountModel
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

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidatorStub()
  const sut = new SignUpController(
    addAccountStub,
    validatorStub
  )
  return {
    sut,
    addAccountStub,
    validatorStub
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
  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const error = new Error()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(error))
    })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(error))
  })
  test('Should return 200 if the proper data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
})
