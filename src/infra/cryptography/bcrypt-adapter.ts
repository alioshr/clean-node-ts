import { Hasher } from '../../data/protocols'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
