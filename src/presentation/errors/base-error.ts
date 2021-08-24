export class AppError {
  public name: string
  public stack?: string
  constructor (public message: string) {

  }
}
