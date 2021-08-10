import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const bodyFields = ['email', 'password']
      for (const field of bodyFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new InvalidParamError(field))
        }
      }

      const httpResponse = {
        userId: 'a',
        token: 'a'
      }

      return ok(httpResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
