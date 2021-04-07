import { Application } from './deps.ts';
import config, { safeConfig } from 'config/mod.ts';
import { mongoClient, rabbitmqClient } from 'common/mod.ts';
import router from './src/routes.ts';
import * as middleware from './src/middleware/index.ts';

console.log('Loaded configuration (with secrets removed)');
console.dir(safeConfig);

mongoClient.connect(config.server.db.connection.maxRetries, config.server.db.connection.retryIntervalMs);
console.dir(config.messaging.rabbitMq);
rabbitmqClient.init(config.messaging.rabbitMq);

const app = new Application();
app.use(middleware.requestResponseLog);
app.use(middleware.errorHandle);
app.use(middleware.viewEngine);
app.use(middleware.graphql.routes());
app.use(middleware.graphql.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Oak Service running - http://${config.server.host}:${config.server.port}/`);
});
await app.listen({ port: config.server.port, hostname: config.server.host });


