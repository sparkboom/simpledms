import { Context, isHttpError, Status } from "oak/mod.ts";

/*
const error = err as ErrorHandler;
c.response.status = error.status || 500;
c.response.body = error.message;
*/

const handleError = async ({response}: Context, next: Function) => {
  try {
    await next();
  } catch (err) {
    console.error(`${err?.message ?? 'An error occurred'}`);
    console.dir(err);
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
