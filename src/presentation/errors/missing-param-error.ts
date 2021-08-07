import { AppError } from './base-error'

export class MissingParamError extends AppError {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
