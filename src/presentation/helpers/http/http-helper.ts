import { ServerError, UnauthorizedError, ConflictError } from '../../errors'
import { HttpResponse } from '../../protocols'
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const conflict = (paramName: string): HttpResponse => ({
  statusCode: 409,
  body: new ConflictError(paramName)
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
