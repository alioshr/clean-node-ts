import { Collection } from 'mongodb'
import { ILogErrorRepository } from '../../../../data/protocols/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

interface sutTypes {
  sut: ILogErrorRepository
}

const makeSut = (): sutTypes => {
  const sut = new LogMongoRepository()

  return {
    sut
  }
}

describe('Log Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on the DB once called', async () => {
    const { sut } = makeSut()
    const stackError = 'Fake stack error'

    await sut.logError(stackError)
    const errorOnDb = await errorCollection.findOne({ stackError: stackError })
    expect(errorOnDb.stackError).toEqual(stackError)
  })
})
