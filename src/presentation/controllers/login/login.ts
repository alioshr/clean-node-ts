import { Validator } from '../../protocols/validator'
import {
  Controller,
  AuthAccount,
  HttpRequest,
  HttpResponse,
  badRequest,
  unauthorized,
  serverError,
  ok
} from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authAccount: AuthAccount,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const credentials = await this.authAccount.auth(httpRequest.body)
      if (!credentials) {
        return unauthorized()
      }

      return ok(credentials)
    } catch (error) {
      return serverError(error)
    }
  }
}
