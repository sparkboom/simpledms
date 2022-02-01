import { AmqpChannel, AmqpConnection, connect, BasicDeliver, BasicProperties, QueueDeclareOk } from '../../deps.ts';


interface DDAqmpConnectionConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
  heartbeatInterval: number;
  frameMax: number;
  loglevel: 'debug' | 'none';
}
type DDAqmpConnectionStatus = 'INITIALIZED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERRORED';

// TODO: support block connection & disconnection notifications
export class DDAmqpConnection {
  private _name: string;
  private _config: DDAqmpConnectionConfig;
  private _connection: Promise<AmqpConnection> | null = null;
  private _channel: AmqpChannel | null = null;
  private _status: DDAqmpConnectionStatus = 'INITIALIZED';
  private _errorDetails: any | null = null;

  constructor(name: string, config: DDAqmpConnectionConfig) {
    this._config = config;
    this._name = name;
  }

  async _connect() {
    try {
      const { hostname, port, username, vhost } = this._config ?? {};
      if (!this._connection) {
        console.log(`DDAmqpConnection[${this._name}]: Connection could not connect. ${username}@${hostname}:${port}${vhost}`);
        return;
      }
      const conn = await this._connection;
      this._status = 'CONNECTED';
      console.log(`DDAmqpConnection[${this._name}]: Connection open. ${username}@${hostname}:${port}${vhost}`);

      // We open the channel alongside the connection as we only have a single thread in Node.
      const connection = await conn.connection;
      this._channel = await connection?.openChannel();
      console.log(`DDAmqpConnection[${this._name}]: Channel open. ${username}@${hostname}:${port}${vhost}`);

      await conn.closed;
      this._status = 'DISCONNECTED';
      this._channel = null;

      console.log(`DDAmqpConnection[${this._name}]: Channel closed. ${username}@${hostname}:${port}${vhost}`);
      console.log(`DDAmqpConnection[${this._name}]: Connection closed. ${username}@${hostname}:${port}${vhost}`);

    } catch (err) {
      this._errorDetails = err;
    }
  }

  open() {
    if (!this._config) {
      throw new Error(`RabbitMQConnection[${this._name}]: No configuration has been set.`);
    }
    this._status = 'CONNECTING';
    this._errorDetails = null;
    this._connection = connect(this._config);
    return this._connection;
  }

  async close() {
    if (this._channel) {
      (await this._channel).close();
      this._channel = null;
    }
    if (!this._connection) {
      return;
    }
    (await this._connection).close();
    this._connection = null;
  }

  get config() { return this._config; }
  get name() { return this._name; }
  get status() { return this._status; }
  get errorDetails() { return this._errorDetails; }
  get channel() { return this._channel; }
  get connection() { return this._connection; }

}
