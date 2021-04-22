import { Context } from "oak/mod.ts";
import config from "config/mod.ts";
import mongoClient from "../clients/mongo.ts";

const performChecks = async () => {
  const checks = {
    mongodb: await mongoClient.testConnection(),
  };
  const isHealthy = Object.values(checks).every( c => c.status === 'ok');
  return {
    checks,
    isHealthy,
  };
};

export const getHealth = async ({response}: Context) => {
  const { isHealthy } = await performChecks();
  // The health endpoint queries whether the service has 'health', 204 for a successful no-content response, otherwise a 404.
  response.status = isHealthy? 204 : 404;
};

export const getStatus = async ({response}: Context) => {
  const { checks, isHealthy } = await performChecks();

  response.body = {
    status: isHealthy? 'ok' : 'fail',
    data: {
      buildVersion: config.build,
      checks
    },
  };
  response.status = 200;
};
