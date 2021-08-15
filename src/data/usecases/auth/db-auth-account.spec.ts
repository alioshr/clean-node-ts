import { AuthResponseData } from '../../../domain/models/auth'
import {
  AuthAccount,
  AuthAccountModel
} from '../../../domain/usecases/auth-account'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenCreator } from '../../protocols/cryptography/token-creator'
import { LoadAccountRepository } from '../../protocols/db/load-account-by-email'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthAccount } from './db-auth-accounts'

const GENERATED_TOKEN = 'valid_token'

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateToken (data: { token: string, id: string }): Promise<void> {
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeAuthResponseData = (): AuthResponseData => ({
  userId: makeFakeAccount().id,
  token: GENERATED_TOKEN
})

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
      return GENERATED_TOKEN
    }
  }
  return new TokenCreatorStub()
}

interface SutTypes {
  sut: AuthAccount
  loadAccountStub: LoadAccountRepository
  hashComparer: HashComparer
  tokenCreator: TokenCreator
  updateAccessToken: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccount()
  const hashComparer = makeHashComparer()
  const tokenCreator = makeTokenCreator()
  const updateAccessToken = makeUpdateAccessTokenRepository()
  const sut = new DbAuthAccount(loadAccountStub, hashComparer, tokenCreator, updateAccessToken)
  return { sut, loadAccountStub, hashComparer, tokenCreator, updateAccessToken }
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
  test('must call HashComparer with the correct params', async () => {
    const { sut, hashComparer } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparer, 'compare')
    await sut.auth(makeFakeAccountModel())
    expect(hashComparerSpy).toHaveBeenCalledWith(
      makeFakeAccountModel().password,
      makeFakeAccount().password
    )
  })
  test('must throw if HashComparer throws', async () => {
    const { sut, hashComparer } = makeSut()
    jest
      .spyOn(hashComparer, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })
  test('must return null if HashComparer passwords do not match', async () => {
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
  test('should return an AccountModel on success', async () => {
    const { sut } = makeSut()
    const authData = await sut.auth(makeFakeAccountModel())
    expect(authData).toEqual(makeAuthResponseData())
  })
  test('Should call UpdateAccessTokenRepositoryStub with the correct params', async () => {
    const { sut, updateAccessToken } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessToken, 'updateToken')
    await sut.auth(makeFakeAccountModel())
    expect(updateAccessTokenSpy).toHaveBeenCalledWith({ id: makeFakeAccount().id, token: GENERATED_TOKEN })
  })
  test('should throw if UpdateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessToken } = makeSut()
    jest
      .spyOn(updateAccessToken, 'updateToken')
      .mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })
})
