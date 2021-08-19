import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { Controller } from '../../../presentation/protocols'
import { LoggerControllerDecorator } from '../../decorators/log'
import { makeSignUpValidations } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidations()
  )

  const logMongoRepository = new LogMongoRepository()
  return new LoggerControllerDecorator(signUpController, logMongoRepository)
}
