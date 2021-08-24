import { Encrypter } from '../../../data/protocols'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}
  async encrypt (data: { [key: string]: any }): Promise<string> {
    const token = jwt.sign(data, this.secretKey)
    return token
  }
}
