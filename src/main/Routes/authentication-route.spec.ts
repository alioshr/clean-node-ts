import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Login Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  let accountsCollection: Collection
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })
  describe('POST / signup', () => {
    test('Should 200 on signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Aliosh',
          email: 'aliosh@t.com',
          password: '123',
          confirmPassword: '123'
        })
        .expect(200)
    })
  })
  describe('POST / login', () => {
    test('Should return 200 on login success', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Aliosh',
        email: 't@t.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 't@t.com',
          password: '123'
        })
        .expect(200)
    })
    test('Should return 401 on login success', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'aliosh@t.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
