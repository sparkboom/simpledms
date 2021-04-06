import { Context, Collection, Bson } from '../../deps.ts';

export const respond = (response: Context['response'], status: number, data: any, message?: string) => {
  response.status = status;
  response.body = {
    status: (status>=200 && status <300)? 'ok' : 'fail',
    data,
    message,
  };
};

export const createObject = async (ctx: Context, model: Collection<any> | null) => {
  const { request, response } = ctx ?? {};
  if (!model) {
    respond(response, 500, null, 'Service not initiated');
    return;
  }
  const body = await request.body();
  let val = null;
  if (!request.hasBody) {
    respond(response, 404, null, 'No data provided');
    return;
  }

  try {
    val = body.value as object;
    await model.insertOne(val);
    respond(response, 201, val);
  } catch (error) {
    console.error(error);
    respond(response, 500, val, error?.message ?? 'none');
  }
};

export const getObjectById = async ({ response, params }: Context | any, model: Collection<any> | null) => {
  if (!model) {
    respond(response, 500, null, 'Service not initiated');
    return;
  }
  if (!params.id) {
    respond(response, 400, null, 'No id parameter was received');
    return;
  }
  if (params.id.length !== 24 ) {
    respond(response, 400, null, 'Id must be 12 bytes long');
    return;
  }
  const val = await model.findOne({ _id: new Bson.ObjectId(params.id) });
  if (!val) {
    respond(response, 404, null, `Resource with id ${params.id} could not be found`);
    return;
  }
  respond(response, 200, val);
};

export const updateObject = async ({ request, response, params }: Context | any, model: Collection<any> | null) => {
  if (!model) {
    respond(response, 500, null, 'Service not initiated');
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
        respond(response, 204, body.value, `Updated document with id: ${id}`);
        return;
      }
    } else {
      respond(response, 404, body.value, `No document with id: ${id} found`);
    }
  } catch (error) {
    respond(response, 500, body?.value ?? null, error?.message ?? 'none');
  }
};

export const getObjects = async ({ response }: Context, model: Collection<any> | null) => {
  if (!model) {
    respond(response, 500, null, 'Service not initiated');
    return;
  }
  const allObjects = await model.find({}).toArray();
  if (allObjects.length === 0) {
    respond(response, 404, null, 'here are no resources');
    return;
  }
  respond(response, 200, allObjects);
};

export const deleteObjectById = async ({ response, params }: Context | any, model: Collection<any> | null) => {
  if (!model) {
    respond(response, 500, null, "Service not initiated");
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
      respond(response, 204, null, `Object with id: ${id} was deleted`);
    }
  } catch (error) {
    respond(response, 500, null, error?.message ?? 'none');
  }
};
