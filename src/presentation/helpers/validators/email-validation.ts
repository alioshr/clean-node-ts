import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { Validator } from '../../protocols/validator'

export class EmailValidation implements Validator {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string
  ) {}

  validate (data: { [key: string]: string }): Error | null {
    const isValidMail = this.emailValidator.isValid(data[this.fieldName])
    if (!isValidMail) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
