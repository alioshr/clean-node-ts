import { AppError } from './base-error'

export class UnauthorizedError extends AppError {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
