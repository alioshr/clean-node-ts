import { AppError } from './base-error'

export class InvalidParamError extends AppError {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
