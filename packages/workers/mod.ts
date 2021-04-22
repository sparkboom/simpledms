import { rabbitMqConsumer, QueueName } from './src/clients/rabbitmq.ts';
import mongoClient from './src/clients/mongo.ts';
import { DocumentSchema } from "common/src/mongodb/models/document.ts";
import * as workers from './src/workers/mod.ts';
import { Bson } from "mongo/mod.ts";

const getDocFromId =  (id: string) => mongoClient?.models?.document?.collection?.findOne({ _id: new Bson.ObjectId(id) });

type Worker = (args: any, props: any, doc: DocumentSchema) => Promise<boolean>;
const messageRoutes: Record<QueueName, Worker | null> = {
  'document.unprocessed': workers.orchestrator.run,
  'document.requireMetaData': workers.metaDataWorker.run,
  'document.requireDupeCheck': workers.dupeWorker.run,
  'document.requireThumbnail': null,
  'document.requireOcr': null,
  'document.fail': null,
};

Object.entries(messageRoutes)
  .filter(([_, handler]) => !!handler)
  .forEach( async ([queueName, handler]) => {
    await rabbitMqConsumer.consume(queueName as QueueName, async (args: any, props: any, message: any) => {
      console.log(`message=${JSON.stringify(message)}`);
      console.log(`Root Worker: Message received. q=${args.routingKey} tag=${args.deliveryTag} messageId=${message.id}`);
      const doc = await getDocFromId(message.id);
      if (!doc) {
        console.log(`Root Worker: ${args.routingKey}#${args.deliveryTag} Document #${message.id} could not be retrieved.`);
        return false;
      }
      return await handler!(args, props, doc);
    });
});

// { "id": "606d110ba7da80a9cfd456a9", "dummy": "1" }

