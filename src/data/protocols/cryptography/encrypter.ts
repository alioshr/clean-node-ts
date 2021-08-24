export interface Encrypter {
  encrypt: (data: {[key: string]: any}) => Promise<string>
}
