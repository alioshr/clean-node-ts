import { DbAuthAccount } from '../../../data/usecases/auth/db-auth-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LoggerControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidationComposite } from './login-validation-factory'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const accountRepository = new AccountMongoRepository()
  const bcryptAdapter = new BCryptAdapter(12)
  const jwtAdapter = new JWTAdapter(env.jwtSecret as string)
  const authAccount = new DbAuthAccount(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(authAccount, makeLoginValidationComposite())

  return new LoggerControllerDecorator(loginController, logMongoRepository)
}
