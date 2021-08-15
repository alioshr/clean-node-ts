import { AuthResponseData } from '../models/auth'

export interface AuthAccountModel {
  email: string
  password: string
}

export interface AuthAccount {
  auth: (authData: AuthAccountModel) => Promise<AuthResponseData | Error | null>
}
