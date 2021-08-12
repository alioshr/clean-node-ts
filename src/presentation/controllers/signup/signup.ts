import { badRequest, serverError, ok } from '../../helpers/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount
} from './signup-protocols'
import { Validator } from '../../helpers/validators/validator'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validator: Validator

  constructor (addAccount: AddAccount, validator: Validator) {
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)
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
