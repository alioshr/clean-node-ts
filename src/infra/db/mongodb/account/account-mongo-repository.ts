import { ObjectId } from 'mongodb'
import {
  type AddUserRepository,
  type LoadAccountRepository,
  type UpdateAccessTokenRepository
} from '../../../../data/protocols/'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
implements
    AddUserRepository,
    UpdateAccessTokenRepository,
    LoadAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const result = await collection.insertOne(accountData)
    const accountId = result.insertedId
    const account = await collection.findOne({ _id: accountId })
    return MongoHelper.map(account)
  }

  async load (email: string): Promise<AccountModel | null | Error> {
    const collection = await MongoHelper.getCollection('accounts')
    const loadedAccount = await collection.findOne({ email })
    if (loadedAccount) {
      return MongoHelper.map(loadedAccount)
    }
    return null
  }

  async updateToken (data: { token: string, id: string }): Promise<void> {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: { token: data.token } }
    )
  }
}
