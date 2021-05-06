import { AccountModel, AddAccount, AddAccountModel, Encrypt, AddUserRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypt: Encrypt
  private readonly addUser: AddUserRepository

  constructor (encrypt: Encrypt, addUser: AddUserRepository) {
    this.encrypt = encrypt
    this.addUser = addUser
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypt.hash(accountData.password)
    const userData = await this.addUser.add(Object.assign({}, accountData, { password: hashedPassword }))
    return userData
  }
}
