import { AuthResponseData } from '../../../domain/models/auth'
import {
  AuthAccount,
  AuthAccountModel
} from '../../../domain/usecases/auth-account'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenCreator } from '../../protocols/cryptography/token-creator'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbAuthAccount implements AuthAccount {
  constructor (
    private readonly loadAccount: LoadAccountRepository,
    private readonly decrypt: HashComparer,
    private readonly tokenCreator: TokenCreator
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
    this.tokenCreator.create({
      name: (account as AccountModel).name,
      id: (account as AccountModel).id
    })
    return await Promise.resolve({ userId: 'a', token: 'a' })
  }
}
