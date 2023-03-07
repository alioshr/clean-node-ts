import { type HashComparer, type Hasher } from '../../../data/protocols'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(value, hash)
    if (!isMatch) {
      return false
    }
    return true
  }
}
