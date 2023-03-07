import { SignUpController } from '../../../../presentation/controllers/credentials/signup/signup-controller'
import { type Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../use-cases/db-add-account-factory'
import { makeDbAuthAccount } from '../../use-cases/db-auth-account-factory'
import { makeSignUpValidationComposite } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidationComposite(),
    makeDbAuthAccount()
  )

  return makeLogControllerDecorator(signUpController)
}
