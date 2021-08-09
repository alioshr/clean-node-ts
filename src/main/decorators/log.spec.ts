import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LoggerControllerDecorator } from './log'

interface sutTypes {
  sut: LoggerControllerDecorator
  controller: Controller

}

const makeHttpResponse = (): HttpResponse => {
  return { statusCode: 200, body: {} }
}

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise((resolve) =>
      resolve(makeHttpResponse())
    )
  }
}

const makeController = (): Controller => {
  return new ControllerStub()
}

const makeSut = (): sutTypes => {
  const controller = makeController()
  const sut = new LoggerControllerDecorator(controller)
  return { sut, controller }
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
    expect(httpResponse).toEqual(makeHttpResponse())
  })
})
