import { type ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import {
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '../../presentation/protocols'

export class LoggerControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: ILogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
