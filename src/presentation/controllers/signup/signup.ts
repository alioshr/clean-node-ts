import { badRequest, serverError } from '../../helpers/http-helper'
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

  handle (httpRequest: HttpRequest): HttpResponse {
    let response: HttpResponse = {
      statusCode: 200,
      body: {}
    }

    try {
      const bodyFields = ['name', 'email', 'password', 'confirmPassword']
      for (const field of bodyFields) {
        if (!httpRequest.body[field]) {
          response = badRequest(new MissingParamError(field))
          return response
        }
      }
      const { name, email, password, confirmPassword } = httpRequest.body
      if (password !== confirmPassword) {
        response = badRequest(new InvalidParamError('confirmPassword'))
        return response
      }
      const isValidMail = this.emailValidator.isValid(email)
      if (!isValidMail) {
        response = badRequest(new InvalidParamError('email'))
        return response
      }
      const newAccount = this.addAccount.add({ name, password, email })
      response.body = newAccount
    } catch (err) {
      response = serverError()
      return response
    }

    return response
  }
}
