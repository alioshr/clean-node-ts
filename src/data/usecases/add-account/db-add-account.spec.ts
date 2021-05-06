import { AddAccountModel } from '../../../domain/usecases/add-account'
import { DbAddAccount } from './db-add-account'
import { Encrypt } from '../../protocols/encrypt'

class EncryptStub implements Encrypt {
  async hash (password: string): Promise<string> {
    return await new Promise(resolve => resolve('hashed password'))
  }
}

interface SutTypes {
  sut: DbAddAccount
  encryptStub: EncryptStub
}

const makeSut = (): SutTypes => {
  const encryptStub = new EncryptStub()
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
})
