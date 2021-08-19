import { Express, Router } from 'express'
// import { readdirSync } from 'fs'
// import path from 'path'
import authRoutes from '../Routes/authentication-route'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  authRoutes(router)
  // readdirSync(path.join(__dirname, './../Routes')).map(async (file) => {
  //   if (!file.includes('.spec.')) {
  //     return (await import(`../Routes/${file}`)).default(router)
  //   }
  // }
  // )
}
