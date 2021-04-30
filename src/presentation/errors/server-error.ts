export class ServerError extends Error {
  constructor () {
    super('Something went wrong')
    this.name = 'ServerError'
  }
}
