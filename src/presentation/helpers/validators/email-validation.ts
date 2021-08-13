import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { Validator } from '../../protocols/validator'

export class EmailValidation implements Validator {
  private readonly emailValidator: EmailValidator
  private readonly fieldName: string

  constructor (emailValidator: EmailValidator, fieldName: string) {
    this.emailValidator = emailValidator
    this.fieldName = fieldName
  }

  validate (data: { [key: string]: string }): Error | null {
    const isValidMail = this.emailValidator.isValid(data[this.fieldName])
    if (!isValidMail) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
