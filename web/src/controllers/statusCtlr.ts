import { Context } from "oak/mod.ts";
import { getStatusReport } from "../domain/app.ts";


export const getStatus = async ({response}: Context) => {
  const { status } = getStatusReport();
  // The health endpoint queries whether the service has 'health', 204 for a successful no-content response, otherwise a 404.
  response.status = status === 'ok'? 204 : 404;
};

export const getStatusDetailed = async ({response}: Context) => {
  response.body = getStatusReport();
  response.status = 200;
};
