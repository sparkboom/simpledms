import { Context } from 'https://deno.land/x/oak/mod.ts';
import { Collection } from 'https://deno.land/x/mongo@v0.22.0/src/collection/mod.ts';
import { Bson } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';

export const createObject = async (ctx: Context, model: Collection<any> | undefined) => {
  const { request, response } = ctx ?? {};
  if (!model) {
    response.status = 500;
    response.body = {
      status: 'fail',
      data: null,
      message: 'Service not initiated',
    };
    return;
  }
  const body = await request.body();
  let val = null;
  if (!request.hasBody) {
    response.status = 404;
    response.body = {
      status: 'fail',
      data: val,
      message: 'No data provided',
    };
    return;
  }

  try {
    val = body.value as object;
    await model.insertOne(val);
    response.body = {
      status: "ok",
      data: val,
    };
    response.status = 201;
  } catch (error) {
    console.error(error);
    response.body = {
      status: "fail",
      data: val,
      message: error?.message ?? 'none',
    };
    response.status = 500;
  }
};

export const getObjectById = async ({ response, params }: Context | any, model: Collection<any> | undefined) => {
  if (!model) {
    response.status = 500;
    response.body = {
      status: 'fail',
      data: null,
      message: 'Service not initiated',
    };
    return;
  }
  if (!params.id) {
    response.body = { status: 'fail', data: null, message: 'No id parameter was received' };
    response.status = 400;
    return;
  }
  if (params.id.length !== 24 ) {
    response.body = { status: 'fail', data: null, message: 'Id must be 12 bytes long' };
    response.status = 400;
    return;
  }
  const val = await model.findOne({ _id: new Bson.ObjectId(params.id) });
  if (!val) {
    response.body = { status: 'fail', data: null, message: `Resource with id ${params.id} could not be found` };
    response.status = 404;
    return;
  }
  response.body = { status: 'ok', data: val };
  response.status = 200;
};

export const updateObject = async ({ request, response, params }: Context | any, model: Collection<any> | undefined) => {
  if (!model) {
    response.status = 500;
    response.body = {
      status: 'fail',
      data: null,
      message: 'Service not initiated',
    };
    return;
  }
  let body: any = null
  try {
    body = await request.body();
    const { id } = params;
    const fetchedDoc = await model.findOne({ _id: { $oid: id } });

    if (fetchedDoc) {
      const { matchedCount } = await model.updateOne(
        { _id: { $oid: id } },
        { $set: { ...body.value } },
      );
      if (matchedCount) {
        response.body = {
          status: "ok",
          data: body.value,
          message: `Updated document with id: ${id}`,
        };
        response.status = 204;
      }
    } else {
      response.body = {
        status: "fail",
        data: body.value,
        message: `No document with id: ${id} found`,
      };
      response.status = 404;
    }
  } catch (error) {
    response.body = {
      status: "fail",
      data: body?.value ?? null,
      message: error?.message ?? 'none',
    };
    response.status = 500;
  }
};

export const getObjects = async ({ response }: Context, model: Collection<any> | undefined) => {
  if (!model) {
    response.status = 500;
    response.body = {
      status: 'fail',
      data: null,
      message: 'Service not initiated',
    };
    return;
  }
  const allObjects = await model.find({}).toArray();
  if (allObjects.length === 0) {
    response.body = { status: 'fail', data: null, message: `There are no resources` };
    response.status = 404;
    return;
  }
  response.body = { status: 'ok', data: allObjects };
  response.status = 200;
};

export const deleteObjectById = async ({ response, params }: Context | any, model: Collection<any> | undefined) => {
  if (!model) {
    response.status = 500;
    response.body = {
      status: 'fail',
      data: null,
      message: 'Service not initiated',
    };
    return;
  }
  try {
    const { id } = params;
    const fetchedContact = await model.findOne({
      $oid: id,
    });

    if (fetchedContact) {
      await model.deleteOne({
        _id: { $oid: id },
      });
      response.body = {
        status: 'ok',
        message: `Object with id: ${id} was deleted`,
      };
      response.status = 204;
    }
  } catch (error) {
    response.body = {
      status: 'fail',
      message: error?.message ?? 'none',
    };
    response.status = 500;
  }
};
