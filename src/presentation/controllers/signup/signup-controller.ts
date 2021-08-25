import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  AuthAccount
} from './signup-controller-protocols'
import { Validator } from '../../protocols/validator'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validator,
    private readonly authAccount: AuthAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const newAccount = await this.addAccount.add({ name, password, email })
      await this.authAccount.auth({ email, password })
      return ok(newAccount)
    } catch (error) {
      return serverError(error)
    }
  }
}
