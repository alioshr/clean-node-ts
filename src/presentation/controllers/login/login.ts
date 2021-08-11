import {
  Controller,
  AuthAccount,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  badRequest,
  MissingParamError,
  InvalidParamError,
  unauthorized,
  serverError,
  ok
} from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authAccount: AuthAccount,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const bodyFields = ['email', 'password']
      for (const field of bodyFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
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
