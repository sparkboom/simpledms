import { MongoClient, delay, config} from '../../deps.ts';
import Document from './models/document.ts';

// TODO:
// - convert into class

const dbConfig = config.server.db;
const mongoClient = {
  client: new MongoClient(),
  connectionString: `mongodb://${dbConfig.user}:${dbConfig.pwd}@${dbConfig.host}:${dbConfig.port}`,
  testConnection,
  dmsDb: null as ReturnType<MongoClient["database"]> | null,
  connect,
  models: {
    document: new Document(),
  }
};

async function connect(maxRetries: number = 0, retryIntervalMs = 5000) {
  for (let x = 1; x <= maxRetries || maxRetries === 0; x++) {
    try {
      console.log(`MongoDB Connection attempt #${x} started.`);
      await mongoClient.client.connect(mongoClient.connectionString);
      mongoClient.dmsDb = mongoClient.client.database(dbConfig.name);
      mongoClient.models.document.db = mongoClient.dmsDb;
      console.log(`Connected to MongoDB @ '${dbConfig.host}:${dbConfig.port}' with user '${dbConfig.user}'`);
      return;
    } catch (err) {
      console.log(`MongoDB Connection attempt #${x} failed.`);
      await delay(retryIntervalMs);
    }
  }
  console.log(`MongoDB Connection retry attempts exhausted.`);
}

export async function testConnection () {
  try {
    const resp = await mongoClient.client.connect(mongoClient.connectionString);
    mongoClient.client.close();
    return {
      status: 'ok',
      data: resp,
    };
  }
  catch ( err ) {
    return {
      status: 'fail',
      data: {
        message: err?.message,
        stack: err?.stack,
      }
    }
  }
};

export const dmsDb = mongoClient.dmsDb;

export default mongoClient;
