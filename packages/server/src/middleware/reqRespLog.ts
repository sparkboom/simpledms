import { Context } from "https://deno.land/x/oak/mod.ts";

export default async ({request, response}: Context, next: Function) => {
  console.log(`Request - HTTP ${request.method} on ${request.url}`);
  const start = Date.now();
  const { method, url } = request;
  await next();
  console.log(JSON.stringify(
    {
      time: Date(),
      method,
      url,
      response_time: Date.now() - start + " millisecond",
      response_status: response.status,
    },
    null,
    '\t',
  ));
};
