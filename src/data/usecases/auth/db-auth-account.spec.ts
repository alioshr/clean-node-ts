import {
  AuthAccount,
  AuthAccountModel
} from '../../../domain/usecases/auth-account'
import { Decrypt } from '../../protocols/cryptography/decrypter'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthAccount } from './db-auth-accounts'

const makeFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'any_password'
})

const makeFakeAccountModel = (): AuthAccountModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccount = (): LoadAccountRepository => {
  class LoadAccountStub implements LoadAccountRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountStub()
}

const makeDecrypt = (): Decrypt => {
  class DecryptStub implements Decrypt {
    async compare (password: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new DecryptStub()
}

interface SutTypes {
  sut: AuthAccount
  loadAccountStub: LoadAccountRepository
  decrypt: Decrypt
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccount()
  const decrypt = makeDecrypt()
  const sut = new DbAuthAccount(loadAccountStub, decrypt)
  return { sut, loadAccountStub, decrypt }
}

describe('DbAuthentication UseCase', () => {
  test('Should call loadEmail.load with the correct email', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'load')
    await sut.auth(makeFakeAccountModel())
    expect(loadAccountSpy).toHaveBeenCalledWith(makeFakeAccountModel().email)
  })
  test('should throw if LoadAccountRepository throws', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })

  test('Must return null if account is not found', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))
    const authResult = await sut.auth(makeFakeAccountModel())
    expect(authResult).toBeNull()
  })
  test('must call Decrypt with the correct params', async () => {
    const { sut, decrypt } = makeSut()
    const decryptSpy = jest.spyOn(decrypt, 'compare')
    await sut.auth(makeFakeAccountModel())
    expect(decryptSpy).toHaveBeenCalledWith(makeFakeAccountModel().password)
  })
  test.skip('must throw if Decrypt throws', async () => {

  })
  test.skip('must return null if Decrypt passwords do not match', async () => {

  })
})
