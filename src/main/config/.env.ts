export default {
  mongoUrl:
    process.env.MONGO_URL ??
    'mongodb+srv://alioshr:Phe5RtueyqkyBPg@cluster0.hr188.mongodb.net/clean-node?retryWrites=true&w=majority',
  port: process.env.PORT ?? 5050
}
