import { AuthResponseData } from '../../../domain/models/auth'
import { AuthAccount, AuthAccountModel } from '../../../domain/usecases/auth-account'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'

export class DbAuthAccount implements AuthAccount {
  constructor (private readonly loadAccount: LoadAccountRepository) {}

  async auth (authData: AuthAccountModel): Promise<AuthResponseData | Error> {
    await this.loadAccount.load(authData.email)
    return await Promise.resolve({ userId: 'a', token: 'a' })
  }
}
