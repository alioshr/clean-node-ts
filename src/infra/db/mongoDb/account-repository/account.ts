import { AddUserRepository } from '../../../../data/protocols'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddUserRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const result = await collection.insertOne(accountData)
    const account = result.ops[0]
    return MongoHelper.map(account)
  }
}
