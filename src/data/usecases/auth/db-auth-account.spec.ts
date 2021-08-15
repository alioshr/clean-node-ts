import {
  AuthAccount,
  AuthAccountModel
} from '../../../domain/usecases/auth-account'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenCreator } from '../../protocols/cryptography/token-creator'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthAccount } from './db-auth-accounts'

const makeFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password'
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

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeTokenCreator = (): TokenCreator => {
  class TokenCreatorStub implements TokenCreator {
    create (data: { id: string, name: string }): string {
      return 'valid_token'
    }
  }
  return new TokenCreatorStub()
}

interface SutTypes {
  sut: AuthAccount
  loadAccountStub: LoadAccountRepository
  hashComparer: HashComparer
  tokenCreator: TokenCreator
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccount()
  const hashComparer = makeHashComparer()
  const tokenCreator = makeTokenCreator()
  const sut = new DbAuthAccount(loadAccountStub, hashComparer, tokenCreator)
  return { sut, loadAccountStub, hashComparer, tokenCreator }
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
    const { sut, hashComparer } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparer, 'compare')
    await sut.auth(makeFakeAccountModel())
    expect(hashComparerSpy).toHaveBeenCalledWith(
      makeFakeAccountModel().password,
      makeFakeAccount().password
    )
  })
  test('must throw if Decrypt throws', async () => {
    const { sut, hashComparer } = makeSut()
    jest
      .spyOn(hashComparer, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })
  test('must return null if Decrypt passwords do not match', async () => {
    const { sut, hashComparer } = makeSut()
    jest
      .spyOn(hashComparer, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))
    const authResult = await sut.auth(makeFakeAccountModel())
    expect(authResult).toBeFalsy()
  })
  test('should call TokenCreator with the correct params', async () => {
    const { sut, tokenCreator } = makeSut()
    const tokenCreatorSpy = jest.spyOn(tokenCreator, 'create')
    await sut.auth(makeFakeAccountModel())
    expect(tokenCreatorSpy).toHaveBeenCalledWith({
      name: makeFakeAccount().name,
      id: makeFakeAccount().id
    })
  })
  test('should throw if TokenCreator throws', async () => {
    const { sut, tokenCreator } = makeSut()
    jest
      .spyOn(tokenCreator, 'create')
      .mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })
})
