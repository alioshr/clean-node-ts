import { Encrypter } from '../../data/protocols'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements Encrypter {
  encrypt (data: { [key: string]: any }): string | Error {
    const token = jwt.sign(data, 'private-secret')
    return token
  }
}
