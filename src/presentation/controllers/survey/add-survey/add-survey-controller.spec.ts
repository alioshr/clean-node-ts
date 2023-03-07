import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Validator
} from '../../../protocols'

class AddSurveyController implements Controller {
  constructor (private readonly validation: Validator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return null
  }
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (data: any): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validator
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidatorStub()
  const sut = new AddSurveyController(validationStub)
  return { sut, validationStub }
}

describe('AddSurvey Controller', () => {
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {}
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
