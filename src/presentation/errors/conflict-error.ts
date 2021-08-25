import { AppError } from './base-error'

export class ConflictError extends AppError {
  constructor (paramName: string) {
    super(`Conflicting data: ${paramName}`)
    this.name = 'ConflictError'
  }
}
