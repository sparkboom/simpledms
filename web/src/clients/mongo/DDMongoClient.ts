import { Database, MongoClient } from 'mongo/mod.ts';
import { delay } from 'async/mod.ts';

type DDMongoClientStatus = 'INITIALIZED' | 'CONNECTED' | 'CONNECTING' |  'DISCONNECTED' | 'ERRORED';

export default class DDMongoClient {

  #dbConfig: any;
  #nativeClient: MongoClient;
  #db: Database | null = null;
  #status: DDMongoClientStatus = 'INITIALIZED';
  #errorDetails: any = null;

  constructor(dbConfig: any) {
    this.#dbConfig = dbConfig;
    this.#nativeClient = new MongoClient();
  }

  get connectionString() {
    return `mongodb://${this.#dbConfig.user}:${this.#dbConfig.pwd}@${this.#dbConfig.host}:${this.#dbConfig.port}`;
  }

  get db() { return this.#db; }

  get status() { return this.#status; }

  get errorDetails() { return this.#errorDetails; }

  async connect(maxRetries: number = 0, retryIntervalMs = 5000) {
    if (this.#status === 'CONNECTED' || this.#status === 'CONNECTING') {
      console.log('Already connected.');
      return;
    }
    const dbConfig = this.#dbConfig;
    this.#status = 'CONNECTING';
    const errors = [];
    for (let x = 1; x <= maxRetries || maxRetries === 0; x++) {
      try {
        console.log(`MongoDB Connection attempt #${x} started.`);

        await this.#nativeClient.connect(this.connectionString);
        this.#db = this.#nativeClient.database(this.#dbConfig.name);

        console.log(
          `MongoDB: Connected ${dbConfig.user}@ '${dbConfig.host}:${dbConfig.port}'`,
        );
        this.#status = 'CONNECTED';
        return true;
      } catch (err) {
        errors.push(err);
        console.log(`MongoDB Connection attempt #${x} failed.`);
        await delay(retryIntervalMs);
      }
    }
    console.log(`MongoDB Connection retry attempts exhausted.`);
    this.#status = 'ERRORED';
    this.#errorDetails = {
      message: `Too many failed attempts.`,
      errors,
    };
    return false;
  }

  async close() {
    this.#nativeClient.close();
    this.#status = 'DISCONNECTED';
  }

}
