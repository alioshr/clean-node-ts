import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddUserRepository,
  LoadAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUser: AddUserRepository,
    private readonly loadAccount: LoadAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | Error | null> {
    const account = await this.loadAccount.load(accountData.email)
    if (account) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const userData = await this.addUser.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return userData
  }
}
