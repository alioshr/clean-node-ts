import { Validator } from '../../protocols/validator'

export class ValidatorComposite implements Validator {
  private readonly validations: Validator[]

  constructor (validations: Validator[]) {
    this.validations = validations
  }

  validate (data: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(data)
      if (error !== null) {
        return error
      }
    }
    return null
  }
}
