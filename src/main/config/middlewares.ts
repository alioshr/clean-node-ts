import { Express } from 'express'
import { bodyParser } from '../Middlewares/body-parser'

export default (app: Express): void => {
  app.use(bodyParser)
}
