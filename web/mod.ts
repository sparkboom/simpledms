import { Application } from 'oak/mod.ts';
import config, { safeConfig } from 'config/mod.ts';
import router from './src/routes.ts';
import * as middleware from './src/middleware/index.ts';
import './src/events.ts';

console.log('Loaded configuration (with secrets removed)');
console.dir(safeConfig);

// Install Middleware
const app = new Application();
app.use(middleware.requestResponseLog);
app.use(middleware.errorHandle);
app.use(middleware.viewEngine);
app.use(middleware.graphql.routes());
app.use(middleware.graphql.allowedMethods());

// Install Router
app.use(router.routes());
app.use(router.allowedMethods());

// Lifecycle Event Listeners & Process Signals

// App Listener
app.addEventListener('listen', () => {
  console.log(`Oak Service running - http://${config.server.host}:${config.server.port}/ with pid ${Deno.pid}`);
});
await app.listen({ port: config.server.port });
