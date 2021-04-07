import config from "config/mod.ts";
import { mongoClient, rabbitmqClient } from "common/mod.ts";
import { Bson } from "mongo/mod.ts";

mongoClient.connect(
  config.server.db.connection.maxRetries,
  config.server.db.connection.retryIntervalMs,
);

const channel = await rabbitmqClient.init(config.messaging.rabbitMq);

if (channel) {

  await channel.consume(
    { queue: 'documents.unprocessed' },
    async (args: any, props: any, data: any) => {
      console.log('Message received');
      console.dir(args);
      console.dir(props);
      const message = JSON.parse(new TextDecoder().decode(data) ?? {});
      console.dir(message);

      const document = mongoClient?.models?.document?.collection;
      if (!document) {
        console.log('MongoDB connection is not ready');
        return;
      }
      console.dir(message.id);
      const doc = await document.findOne({ _id: new Bson.ObjectId(message.id)});
      console.dir(doc);
      await channel.ack({ deliveryTag: args.deliveryTag });
    },
  );
} else {
  console.log('RabbitMQ - channel could not be established');
}
