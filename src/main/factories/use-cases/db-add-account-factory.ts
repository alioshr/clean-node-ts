import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { type AddAccount } from '../../../domain/usecases/add-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(
    bCryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}
