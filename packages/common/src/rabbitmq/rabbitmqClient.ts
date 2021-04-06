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
let publishChannel: AmqpChannel | null = null;
let connection: AmqpConnection | null = null;

const init = async (config: RabbitMQConfig) : Promise<void> => {
  connection = await connect(config.connection);
  publishChannel = await connection.openChannel();
  if (!publishChannel){
    throw new Error('RabbitMQ publish channel could not be created');
  }
  const declareQueues = config.publishQueues.map( q =>  publishChannel?.declareQueue({ queue: q }));
  await Promise.all(declareQueues);
  hasInitialized = true;
};

const publish = async (queueName: QueueName, message: any) => {
  if (!hasInitialized || !publishChannel){
    throw new Error('RabbitMQ connection has not been initialized');
  }
  await publishChannel.publish(
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
  publishChannel,
  publish,
  close,
};
