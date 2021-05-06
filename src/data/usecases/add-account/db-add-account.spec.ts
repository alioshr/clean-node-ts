import { AddAccountModel, Encrypt, AccountModel, AddUserRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypt => {
  class EncryptStub implements Encrypt {
    async hash (password: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed password'))
    }
  }
  return new EncryptStub()
}

const makeAddUser = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add (account: AddAccountModel): Promise<AccountModel | Error> {
      return await new Promise(resolve => resolve({
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_hashed_password'
      }))
    }
  }
  return new AddUserRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encryptStub: Encrypt
  addUserRepositoryStub: AddUserRepository
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypter()
  const addUserRepositoryStub = makeAddUser()
  const sut = new DbAddAccount(encryptStub, addUserRepositoryStub)
  return {
    sut,
    encryptStub,
    addUserRepositoryStub
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
  test('should call AddUserRepository with the correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    const addUserSpy = jest.spyOn(addUserRepositoryStub, 'add')
    const accountData: AddAccountModel = {
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com'
    }
    await sut.add(accountData)
    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      password: 'hashed password',
      email: 'any_email@mail.com'
    })
  })
})
