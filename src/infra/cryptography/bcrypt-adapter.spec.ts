import { Encrypt } from '../../data/protocols'
import { BCryptAdapter } from './bcrypt-adapter'

import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> =>
    await new Promise(resolve => resolve('hash'))
}))

interface SutTypes {
  sut: Encrypt
}

const salt = 12
const makeSut = (): SutTypes => {
  const sut = new BCryptAdapter(salt)
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with the correct values', async () => {
    const { sut } = makeSut()
    const password = 'valid_password'
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash(password)
    expect(hashSpy).toHaveBeenCalledWith(password, 12)
  })

  test('Should return hashed password on success', async () => {
    const { sut } = makeSut()
    const password = 'valid_password'
    const hashedPassword = await sut.hash(password)
    expect(hashedPassword).toBe('hash')
  })
})
