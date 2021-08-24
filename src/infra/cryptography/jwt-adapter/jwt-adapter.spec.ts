import { JWTAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: (): string | Error => 'valid_access_token'
}))

const makeSut = (): JWTAdapter => {
  return new JWTAdapter('private-secret')
}

describe('JWt Adapter', () => {
  test('JWT sign is called with the correct params', () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    expect(signSpy).toHaveBeenCalledWith(
      { id: 'valid_id', name: 'valid_name' },
      'private-secret'
    )
  })

  test.skip('should throw if sign throws', () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      return new Error()
    })
    sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    expect(sut.encrypt).toThrow()
  })

  test('Should return a valid token on success', () => {
    const sut = makeSut()
    const token = sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    console.log(token)
    expect(token).toBeTruthy()
    expect(token).toBe('valid_access_token')
  })
})
