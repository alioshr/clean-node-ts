import { AuthResponseData } from '../../../domain/models/auth'
import { AuthAccount, AuthAccountModel } from '../../../domain/usecases/auth-account'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'

export class DbAuthAccount implements AuthAccount {
  constructor (private readonly loadAccount: LoadAccountRepository) {}

  async auth (authData: AuthAccountModel): Promise<AuthResponseData | Error | null> {
    const account = await this.loadAccount.load(authData.email)
    if (!account) {
      return null
    }
    return await Promise.resolve({ userId: 'a', token: 'a' })
  }
}
