import { AmqpChannel, AmqpConnection, connect } from 'amqp/mod.ts';

export interface DDAmqpConnectionConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
  heartbeatInterval: number;
  frameMax: number;
  loglevel: 'debug' | 'none';
}
type DDAmqpConnectionStatus = 'INITIALIZED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERRORED';

// TODO: support block connection & disconnection notifications
export default class DDAmqpConnection {
  private _name: string;
  private _config: DDAmqpConnectionConfig;
  private _connection: Promise<AmqpConnection> | null = null;
  private _channel: AmqpChannel | null = null;
  private _status: DDAmqpConnectionStatus = 'INITIALIZED';
  private _errorDetails: any | null = null;

  constructor(name: string, config: DDAmqpConnectionConfig) {
    if (!config) {
      throw new Error(`RabbitMQConnection[${name}]: No configuration has been set.`);
    }
    this._config = config;
    this._name = name;
  }

  async _connect() {
    const { hostname, port, username, vhost } = this._config ?? {};
    try {
      this._errorDetails = null;
      this._status = 'CONNECTING';

      if (!this._connection) {
        console.log(`DDAmqpConnection[${this._name}]: Connection could not connect. ${username}@${hostname}:${port}${vhost}`);
        return;
      }
      this._status = 'CONNECTED';
      console.log(`DDAmqpConnection[${this._name}]: Connection open. ${username}@${hostname}:${port}${vhost}`);

      // We open the channel alongside the connection as we only have a single thread in Node/Deno.
      const connection = (await this._connection);
      this._channel = await connection.openChannel();
      console.log(`DDAmqpConnection[${this._name}]: Channel open. ${username}@${hostname}:${port}${vhost}`);

    } catch (err) {
      console.log(`DDAmqpConnection[${this._name}]: err. ${username}@${hostname}:${port}${vhost} - ${err.message}`);
      await this.close();
      this._status = 'ERRORED';
      this._errorDetails = err;
    }
  }

  async _listenToClose() {
    if (!this._connection) {
      return;
    }
    await (await this._connection).closed;
  }

  async open() {
    try {
      this._connection = connect(this._config);
      await this._connect();
      return this._connection;
    } catch (err) {
      this._status = 'ERRORED';
      this._errorDetails = err;
    }
  }

  async close() {
    const { hostname, port, username, vhost } = this._config ?? {};
    if (this._channel) {
      (await this._channel).close();
      this._channel = null;
    }
    console.log(`DDAmqpConnection[${this._name}]: Channel closed. ${username}@${hostname}:${port}${vhost}`);
    if (!this._connection) {
      return;
    }
    (await this._connection).close();
    this._connection = null;
    console.log(`DDAmqpConnection[${this._name}]: Connection closed. ${username}@${hostname}:${port}${vhost}`);
    this._status = 'DISCONNECTED';
  }

  get config() { return this._config; }
  get name() { return this._name; }
  get status() { return this._status; }
  get errorDetails() { return this._errorDetails; }
  get channel() { return this._channel; }
  get connection() { return this._connection; }

}
