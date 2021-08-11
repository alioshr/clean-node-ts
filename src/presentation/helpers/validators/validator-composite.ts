import { Validator } from './validator'

export class ValidatorComposite implements Validator {
  private readonly validations: Validator[]

  constructor (validations: Validator[]) {
    this.validations = validations
  }

  async validate (data: any): Promise<Error | null> {
    for (const validation of this.validations) {
      const error = validation.validate(data)
      if (error !== null) {
        return await Promise.resolve(error) as Error
      }
    }
    return null
  }
}
