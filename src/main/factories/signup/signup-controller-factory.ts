import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { DbAuthAccount } from '../../../data/usecases/auth/db-auth-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LoggerControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidationComposite } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  const accountRepository = new AccountMongoRepository()
  const bcryptAdapter = new BCryptAdapter(12)
  const jwtAdapter = new JWTAdapter(env.jwtSecret as string)
  const authAccount = new DbAuthAccount(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidationComposite(),
    authAccount
  )

  const logMongoRepository = new LogMongoRepository()
  return new LoggerControllerDecorator(signUpController, logMongoRepository)
}
