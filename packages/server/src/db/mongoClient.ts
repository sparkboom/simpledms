import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import config from '../../../config/src/index.ts';

const client = new MongoClient();
const dbConfig = config.server.db;
const connectionString = `mongodb://${dbConfig.user}:${dbConfig.pwd}@${dbConfig.host}:${dbConfig.port}`;
await client.connect(connectionString);
const dmsDb = client.database(dbConfig.name);
console.log(`Connected to MongoDB @ '${dbConfig.host}:${dbConfig.port}' with user '${dbConfig.user}'`);

// TODO: if db connection fails, then continue to run service, start polling for a connection

const testConnection = async () => {
  try {
    await client.connect(connectionString);
    client.close();
    return {
      status: 'ok'
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

export {
  testConnection,
  client,
  dmsDb,
};
