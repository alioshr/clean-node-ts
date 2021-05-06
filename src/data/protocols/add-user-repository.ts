import { AddAccountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'

export interface AddUserRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
