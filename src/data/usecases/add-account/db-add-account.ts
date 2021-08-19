import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddUserRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUser: AddUserRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const userData = await this.addUser.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return userData
  }
}
