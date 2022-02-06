import DDAmqpConnection from "./amqp/DDAmqpConnection.ts";
import config from "config/mod.ts";

export const publisAmqpConn = new DDAmqpConnection('publish', config.messaging.rabbitMq.connection);
try {
  // Do not await this call so web service launches faster
  publisAmqpConn.open();
} catch (err) {
  console.error(err);
}

const basicProps = { contentType: 'application/json' };

class DocAmqpClient {
  private _connection: DDAmqpConnection;
  private _exchangeName: string;
  private _queueName: string;

  constructor(connection: DDAmqpConnection) {
    this._connection = connection;
    this._exchangeName = config.messaging.rabbitMq.exchanges.upload;
    this._queueName = config.messaging.rabbitMq.queues.upload;
  }

  async _declareExchangeQueue() {
    if (!this._connection){
      throw new Error(`connection has disconnected`);
    }
    const ch = this._connection.channel;
    if (!ch) {
      return;
    }

    await ch.declareExchange({
      durable: false,
      exchange: this._exchangeName,
      type: 'direct',
    });
    await ch.declareQueue({
      queue: this._queueName
    });
    await ch.bindQueue({
      queue: this._queueName,
      exchange: this._exchangeName,
      routingKey: this._queueName,
    });
    return ch;
  }

  async postNewDocument(docId: string) {
    const ch = await this._declareExchangeQueue();
    if (!ch) {
      return;
    }

    const content = new TextEncoder().encode(JSON.stringify({ docId }));

    await ch.publish({
      exchange: this._exchangeName,
      routingKey: this._queueName,
    }, basicProps, content);
  }
}

export const amqpDocClient = new DocAmqpClient(publisAmqpConn);
