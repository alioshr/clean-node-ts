import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LoggerControllerDecorator } from './log'

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

const makeSut = (controller: Controller): LoggerControllerDecorator => {
  return new LoggerControllerDecorator(controller)
}

describe('LogControllerDecorator', () => {
  test('Should call the handle method of its encapsulated controller', async () => {
    const controller = makeController()
    const controllerHandleSpy = jest.spyOn(controller, 'handle')
    const sut = makeSut(controller)
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
})
