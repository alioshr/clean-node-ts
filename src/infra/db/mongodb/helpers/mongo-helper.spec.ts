import { type MongoClient } from 'mongodb'
import { MongoHelper as sut } from './mongo-helper'

describe.skip('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect when mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
  test('Should call client.Connect when mongodb is down', async () => {
    await sut.disconnect()
    const connectSpy = jest.spyOn(sut, 'connect')
    await sut.getCollection('accounts')
    expect(connectSpy).toHaveBeenCalled()
    expect(connectSpy).toHaveBeenCalledWith(sut.uri)
  })
  test('Should not call connect in getCollection when mongodb is already connected', async () => {
    const accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()

    const dbSpy = jest.spyOn(sut.client as MongoClient, 'connect')
    expect(dbSpy).toHaveBeenCalledTimes(0)
  })
})
