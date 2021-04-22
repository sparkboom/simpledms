import { DocumentSchema } from 'common/src/mongodb/models/document.ts';

const run = async (args: any, props: any, doc: DocumentSchema): Promise<boolean> => {
  console.log(`Dupe Worker: ${args.queueName}#${args.deliveryTag} Document #${doc._id} received.`);
  return false;
};

export default {
  name: 'Dupe Reporter',
  key: 'simpledms.dupeReporter',
  version: '1.0.0',
  description: 'The Dupe Reporter will generate a hash of each document, record it, and make not of identical documents',
  run,
};
