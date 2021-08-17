import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddUserRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addUser: AddUserRepository

  constructor (hasher: Hasher, addUser: AddUserRepository) {
    this.hasher = hasher
    this.addUser = addUser
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const userData = await this.addUser.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return userData
  }
}
