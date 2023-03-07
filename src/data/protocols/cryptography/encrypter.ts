export interface Encrypter {
  encrypt: (data: Record<string, any>) => Promise<string>
}
