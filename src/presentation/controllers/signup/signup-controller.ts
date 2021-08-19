import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount
} from './signup-controller-protocols'
import { Validator } from '../../protocols/validator'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const newAccount = await this.addAccount.add({ name, password, email })

      return ok(newAccount)
    } catch (error) {
      return serverError(error)
    }
  }
}
