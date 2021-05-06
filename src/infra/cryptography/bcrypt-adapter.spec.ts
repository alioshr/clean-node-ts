import { Encrypt } from '../../data/protocols'
import { BCryptAdapter } from './bcrypt-adapter'

import bcrypt from 'bcrypt'

interface SutTypes {
  sut: Encrypt
}

const makeSut = (): SutTypes => {
  const salt = 12
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
})
