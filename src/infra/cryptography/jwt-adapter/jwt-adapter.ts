import { Encrypter } from '../../../data/protocols'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}
  encrypt (data: { [key: string]: any }): string | Error {
    const token = jwt.sign(data, this.secretKey)
    return token
  }
}
