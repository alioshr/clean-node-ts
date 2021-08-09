import { ILogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
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

const makeHttpResponse = (statusCode: number): HttpResponse => {
  return { statusCode: statusCode, body: {} }
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => resolve(makeHttpResponse(200)))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log (stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub()
}

const makeSut = (): sutTypes => {
  const controller = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LoggerControllerDecorator(controller, logErrorRepositoryStub)
  return { sut, controller, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
  test('Should call the handle method of its encapsulated controller', async () => {
    const { sut, controller } = makeSut()
    const controllerHandleSpy = jest.spyOn(controller, 'handle')
    const httpRequest = {
      body: {
        email: 'a@a.com',
        password: 'pass',
        passwordConfirmation: 'pass',
        name: 'name'
      }
    }
    await sut.handle(httpRequest)
    expect(controllerHandleSpy).toHaveBeenCalled()
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return same httpResponse from Controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'a@a.com',
        password: 'pass',
        passwordConfirmation: 'pass',
        name: 'name'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeHttpResponse(200))
  })
  test('Should call LogErrorRepository log with the correct error if the controller throws an error with status 500', async () => {
    const { sut, controller, logErrorRepositoryStub } = makeSut()
    const error = new Error()
    error.stack = 'fake_stack'
    const errorCaller = serverError(error)
    jest
      .spyOn(controller, 'handle')
      .mockReturnValueOnce(Promise.resolve(errorCaller))
    const loggerSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const httpRequest = {
      body: {
        email: 'a@a.com',
        password: 'pass',
        passwordConfirmation: 'pass',
        name: 'name'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
    expect(loggerSpy).toHaveBeenCalledWith(error.stack)
  })
})
