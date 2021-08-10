import { AuthAccount } from '../../../domain/usecases/auth-account'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

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
      const authAccountResponse = await this.authAccount.auth(httpRequest.body)

      return ok(authAccountResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
