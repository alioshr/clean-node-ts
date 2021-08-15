import {
  AuthAccount,
  AuthAccountModel
} from '../../../domain/usecases/auth-account'
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

interface SutTypes {
  sut: AuthAccount
  loadAccountStub: LoadAccountRepository
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccount()
  const sut = new DbAuthAccount(loadAccountStub)
  return { sut, loadAccountStub }
}

describe('DbAuthentication UseCase', () => {
  test('Should call loadEmail.load with the correct email', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'load')
    await sut.auth(makeFakeAccountModel())
    expect(loadAccountSpy).toHaveBeenCalledWith(makeFakeAccountModel().email)
  })
  test.skip('Must return 400 if account is not found', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))
    const authResult = await sut.auth(makeFakeAccountModel())
    expect(authResult).toEqual({})
  })
})