import { type HashComparer, type Hasher } from '../../../data/protocols'
import { BCryptAdapter } from './bcrypt-adapter'

import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> =>
    await new Promise((resolve) => {
      resolve('hash')
    }),
  compare: async (): Promise<boolean> =>
    await new Promise((resolve) => {
      resolve(true)
    })
}))

interface SutTypes {
  sut: Hasher & HashComparer
}

const salt = 12
const makeSut = (): SutTypes => {
  const sut = new BCryptAdapter(salt)
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt hash with the correct values', async () => {
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

  test('Should throw if bcrypt hash throws', async () => {
    const { sut } = makeSut()
    const password = 'valid_password'
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      new Promise((_resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.hash(password)
    await expect(promise).rejects.toThrow()
  })

  test('Should call bcrypt compare with the correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    const password = 'valid_password'
    await sut.compare(password, 'valid hash')
    expect(compareSpy).toHaveBeenCalledWith(password, 'valid hash')
  })

  test('Should return true from bcrypt compare if values match', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare')

    const password = 'valid_password'
    const response = await sut.compare(password, 'valid hash')
    expect(response).toBe(true)
  })
  test('Should return false from bcrypt compare if values do not match', async () => {
    const { sut } = makeSut()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const password = 'invalid_password'
    const response = await sut.compare(password, 'valid hash')
    expect(response).toBe(false)
  })

  test('Should throw if bcrypt compare throws', async () => {
    const { sut } = makeSut()
    const password = 'valid_password'
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      new Promise((_resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.compare(password, 'valid hash')
    await expect(promise).rejects.toThrow()
  })
})
