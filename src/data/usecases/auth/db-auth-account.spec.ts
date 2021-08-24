import { DbAuthAccount } from './db-auth-account'
import {
  AccountModel,
  AuthAccount,
  AuthAccountModel
} from './db-auth-account-protocols'
import {
  HashComparer,
  Encrypter,
  LoadAccountRepository,
  UpdateAccessTokenRepository
} from '../../protocols'

const GENERATED_TOKEN = 'valid_token'

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateToken (data: { token: string, id: string }): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

// const makeAuthResponseData = (): AuthResponseData => ({
//   userId: makeFakeAccount().id,
//   token: GENERATED_TOKEN
// })

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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt (data: {[key: string]: any}): string | Error {
      return GENERATED_TOKEN
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: AuthAccount
  loadAccountStub: LoadAccountRepository
  hashComparer: HashComparer
  encrypter: Encrypter
  updateAccessToken: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccount()
  const hashComparer = makeHashComparer()
  const encrypter = makeEncrypter()
  const updateAccessToken = makeUpdateAccessTokenRepository()
  const sut = new DbAuthAccount(
    loadAccountStub,
    hashComparer,
    encrypter,
    updateAccessToken
  )
  return { sut, loadAccountStub, hashComparer, encrypter, updateAccessToken }
}

describe('DbAuthentication UseCase', () => {
  test('Should call loadEmail.load with the correct email', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'load')
    await sut.auth(makeFakeAccountModel())
    expect(loadAccountSpy).toHaveBeenCalledWith(makeFakeAccountModel().email)
  })
  // test('should throw if LoadAccountRepository throws', async () => {
  //   const { sut, loadAccountStub } = makeSut()
  //   jest
  //     .spyOn(loadAccountStub, 'load')
  //     .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = sut.auth(makeFakeAccountModel())
  //   await expect(promise).rejects.toThrow()
  // })

  // test('Must return null if account is not found', async () => {
  //   const { sut, loadAccountStub } = makeSut()
  //   jest
  //     .spyOn(loadAccountStub, 'load')
  //     .mockReturnValueOnce(Promise.resolve(null))
  //   const authResult = await sut.auth(makeFakeAccountModel())
  //   expect(authResult).toBeNull()
  // })
  // test('must call HashComparer with the correct params', async () => {
  //   const { sut, hashComparer } = makeSut()
  //   const hashComparerSpy = jest.spyOn(hashComparer, 'compare')
  //   await sut.auth(makeFakeAccountModel())
  //   expect(hashComparerSpy).toHaveBeenCalledWith(
  //     makeFakeAccountModel().password,
  //     makeFakeAccount().password
  //   )
  // })
  // test('must throw if HashComparer throws', async () => {
  //   const { sut, hashComparer } = makeSut()
  //   jest
  //     .spyOn(hashComparer, 'compare')
  //     .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = sut.auth(makeFakeAccountModel())
  //   await expect(promise).rejects.toThrow()
  // })
  // test('must return null if HashComparer passwords do not match', async () => {
  //   const { sut, hashComparer } = makeSut()
  //   jest
  //     .spyOn(hashComparer, 'compare')
  //     .mockReturnValueOnce(Promise.resolve(false))
  //   const authResult = await sut.auth(makeFakeAccountModel())
  //   expect(authResult).toBeFalsy()
  // })
  // test('should call Encrypter with the correct params', async () => {
  //   const { sut, encrypter } = makeSut()
  //   const encrypterSpy = jest.spyOn(encrypter, 'encrypt')
  //   await sut.auth(makeFakeAccountModel())
  //   expect(encrypterSpy).toHaveBeenCalledWith({
  //     name: makeFakeAccount().name,
  //     id: makeFakeAccount().id
  //   })
  // })
  // test('should throw if Encrypter throws', async () => {
  //   const { sut, encrypter } = makeSut()
  //   jest.spyOn(encrypter, 'encrypt')
  //     .mockImplementationOnce(() => { throw new Error() })

  //   const promise = sut.auth(makeFakeAccountModel())
  //   await expect(promise).rejects.toThrow()
  // })
  // test('should return an AccountModel on success', async () => {
  //   const { sut } = makeSut()
  //   const authData = await sut.auth(makeFakeAccountModel())
  //   expect(authData).toEqual(makeAuthResponseData())
  // })
  // test('Should call UpdateAccessTokenRepositoryStub with the correct params', async () => {
  //   const { sut, updateAccessToken } = makeSut()
  //   const updateAccessTokenSpy = jest.spyOn(updateAccessToken, 'updateToken')
  //   await sut.auth(makeFakeAccountModel())
  //   expect(updateAccessTokenSpy).toHaveBeenCalledWith({
  //     id: makeFakeAccount().id,
  //     token: GENERATED_TOKEN
  //   })
  // })
  // test('should throw if UpdateAccessTokenRepositoryStub throws', async () => {
  //   const { sut, updateAccessToken } = makeSut()
  //   jest.spyOn(updateAccessToken, 'updateToken')
  //     .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = sut.auth(makeFakeAccountModel())
  //   await expect(promise).rejects.toThrow()
  // })
})
