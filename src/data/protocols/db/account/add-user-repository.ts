import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { type AccountModel } from '../../../../domain/models/account'

export interface AddUserRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
