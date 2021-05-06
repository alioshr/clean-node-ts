import { AccountModel, AddAccount, AddAccountModel, Encrypt } from './db-add-account-protocols'

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
