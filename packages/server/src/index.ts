import { Application } from 'https://deno.land/x/oak/mod.ts';
import config, { safeConfig } from '../../config/src/index.ts';
import router from "./routes.ts";
import * as middleware from "./middleware/index.ts";

console.log('Loaded configuration (with secrets removed)');
console.dir(safeConfig);
const app = new Application();

app.use(middleware.requestResponseLog);
app.use(middleware.errorHandle);
app.use(middleware.viewEngine);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Oak Service running - http://${config.server.host}:${config.server.port}/`);
});
await app.listen({ port: config.server.port, hostname: config.server.host });


