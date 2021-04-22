import { RabbitMqPublishClient, RabbitMqConsumeClient } from 'common/mod.ts';
import config from 'config/mod.ts';

// Type
export type QueueName = 'document.unprocessed' | 'document.requireMetaData' | 'document.requireDupeCheck' | 'document.requireThumbnail' | 'document.requireOcr' | 'document.fail';

// const rabbitMqClient = new RabbitMqClient<QueueName>(
//   config.messaging.rabbitMq,
// );
// await rabbitMqClient.connect();

const conn = config.messaging.rabbitMq as any;
const rabbitMqConsumer = new RabbitMqConsumeClient<QueueName>(conn);
const rabbitMqPublisher = new RabbitMqPublishClient<QueueName>(conn);

export {
  rabbitMqConsumer,
  rabbitMqPublisher,
};
