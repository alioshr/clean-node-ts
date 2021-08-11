import { MissingParamError } from '../../errors'
import { Validator } from './validator'

export class RequiredFieldValidation implements Validator {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (data: { [key: string]: string }): Promise<Error | null> {
    if (!data[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
