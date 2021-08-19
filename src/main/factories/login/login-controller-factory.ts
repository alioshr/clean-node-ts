import { DbAuthAccount } from '../../../data/usecases/auth/db-auth-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { makeLoginValidations } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const accountRepository = new AccountMongoRepository()
  const bcryptAdapter = new BCryptAdapter(12)
  const jwtAdapter = new JWTAdapter()
  const authAccount = new DbAuthAccount(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )
  return new LoginController(authAccount, makeLoginValidations())
}
