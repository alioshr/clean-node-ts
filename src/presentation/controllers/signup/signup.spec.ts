import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError } from '../../errors'
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any',
    email: 'bla@mail.com',
    password: 'any',
    confirmPassword: 'any'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        confirmPassword: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        password: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('confirmPassword')))
  })
  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_mail@mail.com',
        password: 'any',
        confirmPassword: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('bla@mail.com')
  })
  test('should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const error = new Error()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw error
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(error))
  })
  test('should return 400 if password and confirmPassword do not match', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_mail@mail.com',
        password: 'any',
        confirmPassword: 'any1'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('confirmPassword')))
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
})
