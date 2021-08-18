import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accounts = await MongoHelper.getCollection('accounts')
    await accounts.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@test.com',
      password: 'any_password'
    })

    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@test.com')
    expect(account.password).toBe('any_password')
  })
  test('Should return void on success on updateToken', async () => {
    const sut = makeSut()
    const result = await sut.updateToken({
      id: 'vali_id',
      token: 'valid Token'
    })
    expect(result).toBeFalsy()
  })
})
