import { MissingParamError } from '../../presentation/errors'
import { Validator } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validator {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (data: { [key: string]: string }): Error | null {
    if (!data[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
