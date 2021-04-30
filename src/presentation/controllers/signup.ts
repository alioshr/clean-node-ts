import { badRequest } from './../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let response: HttpResponse = {
      statusCode: 200,
      body: {}
    }
    const bodyFields = ['name', 'email']
    for (const field of bodyFields) {
      if (!httpRequest.body[field]) {
        response = badRequest(new MissingParamError(field))
      }
    }
    return response
  }
}
