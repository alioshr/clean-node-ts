import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

interface IMongoHelper {
  client: MongoClient | null
  uri: string | null
  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Promise<Collection>
  map: (account: any) => AccountModel
}

export const MongoHelper: IMongoHelper = {
  client: null,
  uri: null,

  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  },

  async disconnect () {
    await (this.client as MongoClient).close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return (this.client as MongoClient).db().collection(name)
  },

  map: (collectionElement: any): any => {
    const { _id, ...collectionElementWithoutId } = collectionElement
    return Object.assign({}, collectionElementWithoutId, { id: _id })
  }
}
