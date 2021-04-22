import { DocumentSchema } from 'common/src/mongodb/models/document.ts';
import { rabbitMqPublisher } from '../../clients/rabbitmq.ts';

// Types
// interface OrchestratorReport {

// }
// interface Worker<R> {
//   workerKey: string;
//   report: R;
//   status: 'fail' | 'success';
//   startDate: string;
// }
// interface WorkerHistory {
//   workerHistory: Worker<any>[];
// }

// Worker
const run = async (args: any, props: any, doc: DocumentSchema): Promise<boolean> => {
  if (doc === null) {
    // go through each document in the database
  }
  const id = doc._id;
  console.log(`Orchestrator: ${args.routingKey}#${args.deliveryTag} Document #${id} received.`);
  await rabbitMqPublisher.publish('document.requireMetaData', { id: id });
  console.log(`Orchestrator: Document # ${id} enqueued for document.requireMetaData`);
  await rabbitMqPublisher.publish('document.requireDupeCheck', { id: id });
  console.log(`Orchestrator: Document # ${id} enqueued for document.requireDupeCheck`);
  return true;
}

export default {
  name: 'Orchestrator',
  key: 'simpledms.orchestrator',
  description: 'When provided with a document, the orchestrator will enqueue the document to other queues in which it will be processed. If no document is provided, the worker will progressively scan each document and perform the same steps, this is ideal for a cron job maintenance scan.',
  run,
};
