export interface Encrypt {
  hash: (password: string) => Promise<string>
}

export interface Decrypt {
  validate: (password: string) => Promise<boolean>
}
