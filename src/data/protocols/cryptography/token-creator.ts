export interface TokenCreator {
  create: (data: {[key: string]: any}) => string | Error
}
