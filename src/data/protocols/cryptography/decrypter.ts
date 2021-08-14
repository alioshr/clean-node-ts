export interface Decrypt {
  validate: (password: string) => Promise<boolean>
}
