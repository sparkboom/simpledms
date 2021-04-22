import config from "config/mod.ts";
import { mongoClient } from "common/mod.ts";

mongoClient.connect(
  config.server.db.connection.maxRetries,
  config.server.db.connection.retryIntervalMs,
);

export default mongoClient;
