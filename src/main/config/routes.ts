import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  app.get('/test', (req, res) => {
    res.json({
      message: 'test working'
    })
  })
  readdirSync(path.join(__dirname, './../Routes')).map(async (file) => {
    if (!file.includes('.spec.') && !file.includes('.map')) {
      return (await import(`../Routes/${file}`)).default(router)
    }
  }
  )
}
