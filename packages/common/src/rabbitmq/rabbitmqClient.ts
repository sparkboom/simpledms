import { AmqpChannel, AmqpConnection, connect } from '../../deps.ts';

// Types
interface RabbitMQConfig {
  connection: {
    hostname: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
    heartbeatInterval: number;
    frameMax: number;
    loglevel: 'debug' | 'none';
  },
  publishQueues: string[];
}

// TODO: close connection when server terminates , mongdb too

// Types
type QueueName = 'documents.unprocessed';

//
let hasInitialized = false;
let channel: AmqpChannel | null = null;
let connection: AmqpConnection | null = null;

const init = async (config: RabbitMQConfig) : Promise<AmqpChannel> => {
  connection = await connect(config.connection);
  channel = await connection.openChannel();
  if (!channel){
    throw new Error('RabbitMQ publish channel could not be created');
  }
  const declareQueues = config.publishQueues.map( q =>  channel?.declareQueue({ queue: q }));
  await Promise.all(declareQueues);
  hasInitialized = true;
  const { hostname, port, username, vhost } = config.connection;
  console.log(`RabbitMQ connection established - ${username}@${hostname}:${port}${vhost}`);
  return channel;
};

const publish = async (queueName: QueueName, message: any) => {
  if (!hasInitialized || !channel){
    throw new Error('RabbitMQ connection has not been initialized');
  }
  await channel.publish(
    { routingKey: queueName },
    { contentType: "application/json" },
    new TextEncoder().encode(JSON.stringify(message)),
  );
};

const close = async ()  => {
  if (!connection) {
    return;
  }
  await connection.close();
};

export default {
  init,
  channel,
  publish,
  close,
};
