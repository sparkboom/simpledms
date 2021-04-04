import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import config from '../../../config/src/index.ts';

// mongodb://root:rootpassword@localhost:27017
const client = new MongoClient();
const dbConfig = config.server.db;
await client.connect(`mongodb://${dbConfig.user}:${dbConfig.pwd}@${dbConfig.host}:${dbConfig.port}`);
const db = client.database(dbConfig.name);
console.log(`Connected to MongoDB @ '${dbConfig.host}:${dbConfig.port}' with user '${dbConfig.user}'`);

export default db;
