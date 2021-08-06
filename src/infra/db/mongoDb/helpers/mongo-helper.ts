import { Collection, MongoClient } from 'mongodb'

interface IMongoHelper {
  client: MongoClient | null
  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
}

export const MongoHelper: IMongoHelper = {
  client: null,

  async connect (uri: string) {
    this.client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  },

  async disconnect () {
    await (this.client as MongoClient).close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
