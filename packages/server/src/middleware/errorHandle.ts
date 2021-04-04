import { Context } from "https://deno.land/x/oak/mod.ts";
import { isHttpError, Status } from "https://deno.land/x/oak/mod.ts";

const handleError = async ({response}: Context, next: Function) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case Status.NotFound:
          response.status = 404;
          response.body = {
            status: 'fail',
            message: 'resource not found',
            data: null,
          };
          break;
        default:
          // handle other statuses
      }
    } else {
      // rethrow if you can't handle the error
      throw err;
    }
  }
};

export default handleError;
