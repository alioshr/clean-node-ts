import { InvalidParamError } from '../../presentation/errors'
import { type EmailValidator } from '../protocols/emailValidator'
import { type Validator } from '../../presentation/protocols/validator'

export class EmailValidation implements Validator {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string
  ) {}

  validate (data: Record<string, string>): Error | null {
    const isValidMail = this.emailValidator.isValid(data[this.fieldName])
    if (!isValidMail) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
