import { AddAccountModel } from '../../../domain/usecases/add-account'
import { DbAddAccount } from './db-add-account'
import { Encrypt } from '../../protocols/encrypt'

const makeEncrypter = (): Encrypt => {
  class EncryptStub implements Encrypt {
    async hash (password: string): Promise<string | Error> {
      return await new Promise(resolve => resolve('hashed password'))
    }
  }
  return new EncryptStub()
}

interface SutTypes {
  sut: DbAddAccount
  encryptStub: Encrypt
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypter()
  const sut = new DbAddAccount(encryptStub)
  return {
    sut,
    encryptStub
  }
}

describe('DbAddAccount use case', () => {
  test('should call hash with the correct password', async () => {
    const { sut, encryptStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptStub, 'hash')
    const accountData: AddAccountModel = {
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })
  test('should throw if encrypt throws', async () => {
    const { sut, encryptStub } = makeSut()
    jest.spyOn(encryptStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData: AddAccountModel = {
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
