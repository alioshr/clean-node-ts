import env from '../../config/env'
import { DbAuthAccount } from '../../../data/usecases/auth/db-auth-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { type AuthAccount } from '../../../domain/usecases/auth-account'

export const makeDbAuthAccount = (): AuthAccount => {
  const accountRepository = new AccountMongoRepository()
  const bcryptAdapter = new BCryptAdapter(12)
  const jwtAdapter = new JWTAdapter(env.jwtSecret as string)
  const authAccount = new DbAuthAccount(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )
  return authAccount
}
