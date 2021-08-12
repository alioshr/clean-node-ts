import { InvalidParamError } from '../../errors'
import { Validator } from '../../protocols/validator'

export class CompareFieldsValidation implements Validator {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (data: { [key: string]: string }): Error | null {
    if (data[this.fieldName] !== data[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
    return null
  }
}
