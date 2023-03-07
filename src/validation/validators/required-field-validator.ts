import { MissingParamError } from '../../presentation/errors'
import { type Validator } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validator {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (data: Record<string, string>): Error | null {
    if (!data[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
