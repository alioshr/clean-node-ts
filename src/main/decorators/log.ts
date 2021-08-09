import { ILogErrorRepository } from '../../data/protocols/log-error-repository'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

export class LoggerControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: ILogErrorRepository

  constructor (controller: Controller, logErrorRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      // log
      await this.logErrorRepository.log(httpResponse.body.stack)
    }
    return httpResponse
  }
}
