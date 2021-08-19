import {
  AuthResponseData,
  AccountModel,
  AuthAccount,
  AuthAccountModel
} from './db-auth-account-protocols'
import {
  HashComparer,
  Encrypter,
  LoadAccountRepository,
  UpdateAccessTokenRepository
} from '../../protocols'

export class DbAuthAccount implements AuthAccount {
  constructor (
    private readonly loadAccount: LoadAccountRepository,
    private readonly decrypt: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {}

  async auth (
    authData: AuthAccountModel
  ): Promise<AuthResponseData | Error | null> {
    const account = await this.loadAccount.load(authData.email)
    if (!account) {
      return null
    }
    const isValid = await this.decrypt.compare(
      authData.password,
      (account as AccountModel).password
    )
    if (!isValid) {
      return null
    }
    const token = this.encrypter.encrypt({
      name: (account as AccountModel).name,
      id: (account as AccountModel).id
    })

    await this.updateAccessToken.updateToken({
      token: token as string,
      id: (account as AccountModel).id
    })
    return { userId: (account as AccountModel).id, token: token as string }
  }
}
