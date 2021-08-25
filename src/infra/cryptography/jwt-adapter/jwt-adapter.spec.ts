import { JWTAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'valid_access_token'
}))

const makeSut = (): JWTAdapter => {
  return new JWTAdapter('private-secret')
}

describe('JWt Adapter', () => {
  test('JWT sign is called with the correct params', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    expect(signSpy).toHaveBeenCalledWith(
      { id: 'valid_id', name: 'valid_name' },
      'private-secret'
    )
  })

  test('should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    await expect(promise).rejects.toThrow()
  })

  test('Should return a valid token on success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt({ id: 'valid_id', name: 'valid_name' })
    expect(token).toBeTruthy()
    expect(token).toBe('valid_access_token')
  })
})
