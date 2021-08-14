import { ILogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LoggerControllerDecorator } from './log'

interface sutTypes {
  sut: LoggerControllerDecorator
  controller: Controller
  logErrorRepositoryStub: ILogErrorRepository
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'a@a.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    name: 'name'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid_password'
})

const makeHttpResponse = (): HttpResponse => {
  return ok(makeFakeAccount())
}

const makeFakeServerError = (): {
  serverError: HttpResponse
  stack: string
} => {
  const error = new Error()
  error.stack = 'fake_stack'
  return {
    serverError: serverError(error),
    stack: error.stack
  }
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => resolve(makeHttpResponse()))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError (stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub()
}

const makeSut = (): sutTypes => {
  const controller = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LoggerControllerDecorator(controller, logErrorRepositoryStub)
  return { sut, controller, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
  test('Should call the handle method of its encapsulated controller', async () => {
    const { sut, controller } = makeSut()
    const controllerHandleSpy = jest.spyOn(controller, 'handle')
    await sut.handle(makeHttpRequest())
    expect(controllerHandleSpy).toHaveBeenCalled()
    expect(controllerHandleSpy).toHaveBeenCalledWith(makeHttpRequest())
  })

  test('Should return same httpResponse from Controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(makeHttpResponse())
  })
  test('Should call LogErrorRepository log with the correct error if the controller throws an error with status 500', async () => {
    const { sut, controller, logErrorRepositoryStub } = makeSut()
    const { serverError, stack } = makeFakeServerError()
    jest
      .spyOn(controller, 'handle')
      .mockReturnValueOnce(Promise.resolve(serverError))
    const loggerSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse.statusCode).toEqual(500)
    expect(loggerSpy).toHaveBeenCalledWith(stack)
  })
})
