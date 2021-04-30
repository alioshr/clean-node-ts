import { badRequest } from './../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let response: HttpResponse = {
      statusCode: 200,
      body: {}
    }

    if (!httpRequest.body.name) {
      response = badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      response = badRequest(new MissingParamError('email'))
    }
    return response
  }
}
