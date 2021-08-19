import 'dotenv/config'

export default {
  mongoUrl: process.env.MONGO_URL ?? process.env.MONGO,
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.SECRET_KEY
}
