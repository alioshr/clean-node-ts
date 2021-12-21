import { InvalidParamError } from '../../presentation/errors'
import { Validator } from '../../presentation/protocols/validator'

export class CompareFieldsValidation implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (data: { [key: string]: string }): Error | null {
    if (data[this.fieldName] !== data[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
    return null
  }
}
