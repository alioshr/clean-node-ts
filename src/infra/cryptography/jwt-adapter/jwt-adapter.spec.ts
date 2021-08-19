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

  test('Should return a valid token on success', () => {
    const sut = makeSut()
    const token = sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    expect(token).toBeTruthy()
    expect(token).toBe('valid_access_token')
  })

  test('should throw if sign throws', () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.encrypt).toThrow()
  })
})
