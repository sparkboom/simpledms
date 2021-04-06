import config from "../../config/src/index.ts";
import { mongoClient, rabbitmqClient } from "../../common/src/mod.ts";

mongoClient.connect(
  config.server.db.connection.maxRetries,
  config.server.db.connection.retryIntervalMs,
);
rabbitmqClient.init(config.messaging.rabbitMq);

