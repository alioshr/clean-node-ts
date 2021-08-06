import { Express } from 'express'
import { bodyParser } from '../Middlewares/body-parser'
import { cors } from '../Middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
