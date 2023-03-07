import { type Validator } from '../../presentation/protocols/validator'
import { ValidatorComposite } from './validator-composite'

const makeValidations = (): Validator[] => {
  class ValidationStub implements Validator {
    validate (data: any): Error | null {
      return null
    }
  }
  return [new ValidationStub()]
}

interface SutTypes {
  sut: ValidatorComposite
  validations: Validator[]
}

const makeSut = (): SutTypes => {
  const validations = makeValidations()
  const sut = new ValidatorComposite(validations)
  return { sut, validations }
}

describe('ValidatorComposite', () => {
  test('must return null if on success', () => {
    const { sut } = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(null)
  })
  test('must return an error if if dependency does not validate', () => {
    const { sut, validations } = makeSut()
    const error = new Error()
    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(error)
    const errorResult = sut.validate({})
    expect(errorResult).toEqual(error)
  })
})
