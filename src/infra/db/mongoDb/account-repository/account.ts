import { AddUserRepository, UpdateAccessTokenRepository } from '../../../../data/protocols'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddUserRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const result = await collection.insertOne(accountData)
    const account = result.ops[0]
    return MongoHelper.map(account)
  }

  async updateToken (data: { token: string, id: string }): Promise<void> {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.updateOne({ _id: data.id }, { $set: { token: data.token } })
  }
}
