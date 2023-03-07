import {
  badRequest,
  serverError,
  ok,
  conflict
} from '../../../helpers/http/http-helper'
import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type AddAccount,
  type AuthAccount
} from './signup-controller-protocols'
import { type Validator } from '../../../protocols/validator'

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
      if (!newAccount) {
        return conflict('email exists')
      }
      const credentials = await this.authAccount.auth({ email, password })

      return ok(credentials)
    } catch (error) {
      return serverError(error)
    }
  }
}
