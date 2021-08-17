export interface Encrypter {
  encrypt: (data: {[key: string]: any}) => string | Error
}
