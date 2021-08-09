import {
  AddAccountModel,
  Encrypt,
  AccountModel,
  AddUserRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypt => {
  class EncryptStub implements Encrypt {
    async hash (password: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed password'))
    }
  }
  return new EncryptStub()
}

const makeAddUser = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddUserRepositoryStub()
}
const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  password: 'any_password',
  email: 'any_email@mail.com'
})
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid@email.com',
  name: 'valid_name',
  password: 'hashed password'
})
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
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })
  test('should throw if encrypt throws', async () => {
    const { sut, encryptStub } = makeSut()
    jest
      .spyOn(encryptStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
  test('should call AddUserRepository with the correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    const addUserSpy = jest.spyOn(addUserRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      password: 'hashed password',
      email: 'any_email@mail.com'
    })
  })
  test('should throw if AddUserRepository throws', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    jest
      .spyOn(addUserRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
