export interface Decrypt {
  compare: (password: string) => Promise<boolean>
}
