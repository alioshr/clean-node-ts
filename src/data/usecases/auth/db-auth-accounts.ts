import { AuthResponseData } from '../../../domain/models/auth'
import { AuthAccount, AuthAccountModel } from '../../../domain/usecases/auth-account'
import { Decrypt } from '../../protocols/cryptography/decrypter'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'

export class DbAuthAccount implements AuthAccount {
  constructor (
    private readonly loadAccount: LoadAccountRepository,
    private readonly decrypt: Decrypt
  ) {}

  async auth (authData: AuthAccountModel): Promise<AuthResponseData | Error | null> {
    const account = await this.loadAccount.load(authData.email)
    if (!account) {
      return null
    }
    const isValid = await this.decrypt.compare(authData.password)
    if (!isValid) {
      return null
    }
    return await Promise.resolve({ userId: 'a', token: 'a' })
  }
}
