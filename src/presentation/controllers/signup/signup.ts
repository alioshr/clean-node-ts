import { badRequest, serverError, ok } from '../../helpers/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './signup-protocols'
import { MissingParamError } from '../../errors/missing-param-error'
import { InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const bodyFields = ['name', 'email', 'password', 'confirmPassword']
      for (const field of bodyFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, confirmPassword } = httpRequest.body
      if (password !== confirmPassword) {
        return badRequest(new InvalidParamError('confirmPassword'))
      }
      const isValidMail = this.emailValidator.isValid(email)
      if (!isValidMail) {
        return badRequest(new InvalidParamError('email'))
      }
      const newAccount = await this.addAccount.add({ name, password, email })
      return ok(newAccount)
    } catch (err) {
      return serverError()
    }
  }// ncrunch: no coverage
}
