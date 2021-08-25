import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLoginValidationComposite } from './login-validation-factory'
import { makeDbAuthAccount } from '../../use-cases/db-auth-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthAccount(), makeLoginValidationComposite())
  return makeLogControllerDecorator(loginController)
}
