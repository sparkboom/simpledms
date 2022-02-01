import { AmqpChannel, AmqpConnection, connect, BasicDeliver, BasicProperties, QueueDeclareOk } from '../../deps.ts';

const ddAqmpConfig = {
  exchangeName: 'dd.doc.',
};

export class DDAqmpDocClient {
  private _channel: AmqpChannel | null = null;

  constructor(channel: AmqpChannel, exchangeName = 'dd.doc', queueName = 'dd.doc.upload.success') {
    this._channel = channel;
  }

  postNewDocument(docId: string) {
    if (!this._channel){
      throw new Error(`Channel has disconnected`);
    }
    const ch = this._channel;

    const queue = await ch.declareExchange({ queue: queueName});
    const queue = await ch.declareQueue({ queue: queueName});

  }

}
