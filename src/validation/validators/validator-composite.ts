import { type Validator } from '../../presentation/protocols/validator'

export class ValidatorComposite implements Validator {
  constructor (private readonly validations: Validator[]) {}

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
