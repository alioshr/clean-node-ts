import { AccountModel } from '../usecases/add-account/db-add-account-protocols'

export interface LoadAccountRepository {
  load: (email: string) => Promise<AccountModel | null | Error>
}
