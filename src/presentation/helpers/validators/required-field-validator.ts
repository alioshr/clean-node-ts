import { MissingParamError } from '../../errors'
import { Validator } from '../../protocols/validator'

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
