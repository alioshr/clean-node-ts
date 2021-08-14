import { ILogErrorRepository } from '../../../../data/protocols/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

interface IErrorLog {
  timeStamp: string
  stackError: string
}

export class LogMongoRepository implements ILogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorsCollection = await MongoHelper.getCollection('errors')
    const log: IErrorLog = {
      stackError: stack,
      timeStamp: new Date().toISOString()
    }
    await errorsCollection.insertOne(log)
  }
}
