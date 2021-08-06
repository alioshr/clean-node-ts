import request from 'supertest'
import app from '../config/app'

describe('Sign-up route', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .expect(200)
  })
})
