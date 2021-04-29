import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let response: HttpResponse = {
      statusCode: 200,
      body: {}
    }

    if (!httpRequest.body.name) {
      response = {
        statusCode: 400,
        body: new Error('Missing Param: name')
      }
    }
    if (!httpRequest.body.email) {
      response = {
        statusCode: 400,
        body: new Error('Missing Param: email')
      }
    }
    return response
  }
}
