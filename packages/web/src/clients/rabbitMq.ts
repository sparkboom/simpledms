import { RabbitMqPublishClient } from "common/mod.ts";
import config from "config/mod.ts";

const rabbitMqClient = new RabbitMqPublishClient<'document.unprocessed'>(config.messaging.rabbitMq);

export default rabbitMqClient;
