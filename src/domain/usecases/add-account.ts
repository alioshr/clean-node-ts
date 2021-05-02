import { AccountModel } from '../models/account'

export interface AddAccountModel {
  name: string
  password: string
  email: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => AccountModel | Error
}
