export interface Encrypt {
  hash: (password: string) => Promise<string>
}
