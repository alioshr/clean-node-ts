import { AppError } from './base-error'

export class ServerError extends AppError {
  constructor (stack: string | null) {
    super('Something went wrong')
    this.name = 'ServerError'
    this.stack = stack as string
  }
}
