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

  beforeEach(async () => {
    const accounts = await MongoHelper.getCollection('accounts')
    await accounts.deleteMany({})
  })

  test('Should return valid credentials on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Aliosh',
        email: 'aliosh@t.com',
        password: '123',
        confirmPassword: '123'
      })

    await request(app)
      .post('/api/login')
      .send({
        email: 'aliosh@t.com',
        password: '123'
      })
      .expect(200)
  })
})
