import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LoggerControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  )
  return new LoggerControllerDecorator(signUpController, {
    logError: async function (stack) {
      return await Promise.resolve()
    }
  })
}
