import { _, __dirname } from './deps.ts';
import { resolve } from "std/path/mod.ts";

// Types
interface MongoDBConfig {
  host: string;
  port: string;
  name: string;
  user: string;
  pwd: string;
  connection: {
    maxRetries: number;
    retryIntervalMs: number;
  };
  exchanges: Record<string, string>;
  queues: Record<string, string>;
}

interface RabbitMqConnectionConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
  heartbeatInterval: number;
  frameMax: number;
  loglevel: 'debug' | 'none';
}
interface ServerConfig {
  host: string;
  port: number,
  db: MongoDBConfig;
}

interface Config {
  build: string;
  server: ServerConfig;
  database: {
    file: {
      basePath: string;
      acceptedContentTypes: string[];
    };
  };
  messaging: {
    rabbitMq: {
      connection: RabbitMqConnectionConfig;
      publishQueues: string[];
      exchanges: Record<string, string>;
      queues: Record<string, string>;
    };
  };
}

// Implementation

const getConfig = (filename: string) => {
  const confPath = resolve(__dirname, `./config/${filename}`);
  console.log(`Loading configuration ${confPath}`);
  return JSON.parse(Deno.readTextFileSync(confPath));
};

const config = getConfig('config.json');
const secrets = getConfig("secrets.json");
const fullConfig = _.merge({}, config, secrets)  as Config;

export const safeConfig = config  as Config;
export default fullConfig;
