import { SignUpController } from './signup'

describe('Auth Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      email: 'any@mail.com',
      password: 'any',
      confirmPassword: 'any'
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing Param: name'))
  })
})
