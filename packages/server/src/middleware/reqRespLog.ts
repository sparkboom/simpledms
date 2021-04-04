import { Context } from "https://deno.land/x/oak/mod.ts";

export default async ({request, response}: Context, next: Function) => {
  console.log(`Request - HTTP ${request.method} on ${request.url}`);
  await next();
  console.log(`Response - HTTP ${request.method} on ${request.url} - ${response.status}`);
};
