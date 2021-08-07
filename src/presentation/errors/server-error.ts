import { AppError } from './base-error'

export class ServerError extends AppError {
  constructor () {
    super('Something went wrong')
    this.name = 'ServerError'
  }
}
