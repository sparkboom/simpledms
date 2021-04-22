import { AmqpChannel, AmqpConnection, connect, BasicDeliver, BasicProperties, QueueDeclareOk } from '../../deps.ts';
import { cyan, magenta } from 'https://deno.land/std@0.59.0/fmt/colors.ts';

// Types
interface RabbitMQConnectionConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
  heartbeatInterval: number;
  frameMax: number;
  loglevel: 'debug' | 'none';
}
interface RabbitMQConfig {
  connection: RabbitMQConnectionConfig;
  publishQueues: string[];
}
type RabbitMQConsumeCallback =  (args: BasicDeliver, props: BasicProperties, data: any, channel: AmqpChannel | null) => Promise<boolean>;
type RabbitMqConnectionStatus = 'INITIALIZED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERRORED';
// This shouldn't be in the client - it is app -specific

export class RabbitMqConnection {

  private _connection: Promise<AmqpConnection> | null = null;
  private _config: RabbitMQConnectionConfig | null = null;
  private _status: RabbitMqConnectionStatus = 'INITIALIZED';
  private _errorDetails: any | null = null;
  private _name: string;

  constructor (name: string, config: RabbitMQConnectionConfig) {
    this._name = name;
    this._config = config;
  }

  get status (): RabbitMqConnectionStatus {
    return this._status;
  }

  get errorDetails (): RabbitMqConnectionStatus {
    return this._errorDetails;
  }

  get config (): RabbitMQConnectionConfig | null {
    return this._config;
  }

  set config (config: RabbitMQConnectionConfig | null) {
    this._config = config;
  }

  get name (): string | null {
    return this._name;
  }

  get connection(): Promise<AmqpConnection> {
    if (this._connection) {
      return this._connection;
    }
    return this.connect();
  }

  async connect(): Promise<AmqpConnection> {
    if (!this._config) {
      throw new Error(`RabbitMQConnection[${this._name}]: No configuration has been set.`);
    }
    this._status = 'CONNECTING';
    this._errorDetails = null;
    const { hostname, port, username, vhost } = this._config ?? {};
    this._connection = connect(this._config);
    this._connection
      .then(connection => {
        this._status = 'CONNECTED';
        console.log(`RabbitMQConnection[${this._name}]: Connection open. ${username}@${hostname}:${port}${vhost}`);
        return connection.closed;
      })
      .then(() => {
        this._status = 'DISCONNECTED';
      })
      .catch(err => {
        this._errorDetails = err;
      });
    return this._connection;
  }

  // TODO: support connection retry etc

  async close() {
    if (!this._connection) {
      return;
    }
    (await this._connection).close();
    this._connection = null;
  }
}

// TODO:
// - support reconnect when connection lost, with timeout support
export class RabbitMqPublishClient<QT extends string> {
  // // Use one channel
  private _connection: RabbitMqConnection | null = null;

  constructor(connection: RabbitMqConnection) {
    this._connection = connection;
  }

  async publish(queueName: QT, message: any) {
    const connection = await this._connection?.connection;
    const channel = await connection?.openChannel();
    try {
      if (!channel){
        throw new Error(`${ cyan(RabbitMqPublishClient) } Publish channel could not be creatd.`);
      }
      const queue = await channel.declareQueue({ queue: queueName});
      console.debug(`${ cyan(RabbitMqPublishClient) } Publish channel declared. q=${queueName} messageCount=${queue?.messageCount} consumerCount=${queue?.consumerCount}`);

      await channel.publish(
        { routingKey: queueName },
        { contentType: "application/json" },
        new TextEncoder().encode(JSON.stringify(message)),
      );

      console.log(`${ cyan(RabbitMqPublishClient) } q=${queueName}. Produce channel closed.`);
      await channel.close();
    } catch (err) {
      console.error(`${ cyan(RabbitMqPublishClient) } q=${queueName} Publish Error  err=` + err?.message ?? err.toString());
    }
  }

  get connection() {
    return this._connection;
  }
}


export class RabbitMqConsumeClient<QT extends string> {

  private _connection: RabbitMqConnection | null = null;

  constructor(connection: RabbitMqConnection) {
    this._connection = connection;
  }

  async consume(queueName: QT, cb: RabbitMQConsumeCallback) {
    const connection = await this._connection?.connection;
    const channel = await connection?.openChannel();

    await channel.declareQueue({ queue: queueName });
    await channel.consume(
      { queue: queueName },
      async (args: BasicDeliver, props: BasicProperties, data: Uint8Array) => {
        let ack = false;
        try {
          console.log(`RabbitMQConsumeClient: q=${queueName}#${args.deliveryTag} args=` + JSON.stringify(args));
          console.log(`RabbitMQConsumeClient: q=${queueName}#${args.deliveryTag} props=` + JSON.stringify(props));
          const message = JSON.parse(new TextDecoder().decode(data));
          console.log(`RabbitMQConsumeClient: q=${queueName}#${args.deliveryTag} message=` + JSON.stringify(message));
          ack = await cb(args, props, message, channel);
          if (ack) {
            await channel.ack({ deliveryTag: args.deliveryTag });
            console.log(`RabbitMQConsumeClient: q=${queueName}#${args.deliveryTag} Acknowledged & Dequeued`);
            return;
          }
        } catch (err) {
          console.log(`RabbitMQConsumeClient: q=${queueName}#${args.deliveryTag} Error Caught err=${err?.message ?? err?.toString() ?? 'no error info'}`);
        }
        console.log(`RabbitMQConsumeClient: q=${queueName}#${args.deliveryTag} Not Acknowledged, Remains`);
      },
    );
  }

  get connection() {
    return this._connection;
  }
}
