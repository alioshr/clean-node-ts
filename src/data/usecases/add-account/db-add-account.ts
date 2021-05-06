import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Encrypt } from '../../protocols/encrypt'

export class DbAddAccount implements AddAccount {
  private readonly encrypt: Encrypt

  constructor (encrypt: Encrypt) {
    this.encrypt = encrypt
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.encrypt.hash(accountData.password)
    return {
      id: 'string',
      name: accountData.name,
      password: accountData.password,
      email: accountData.email
    }
  }
}
