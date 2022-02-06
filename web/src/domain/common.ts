import { Collection, Bson, Document, Filter } from "mongo/mod.ts";
import { ld } from 'deno_lodash/mod.ts';

export type ReportStatus = 'success' | 'fail';
export interface Report {
  status: ReportStatus;
  code: number;
  data?: any;
  error?: string;
  details?: any;
}

// Helpers
export const createResponse = (status: ReportStatus, code: number, data?: any, error?: string, details?: any): Report => (ld.pickBy({
  status,
  code,
  data,
  error,
  details,
}, (pv: any) => !!pv) as Report);

export const responses = {
  badRequest: (msg: string, details?: any) => createResponse('fail', 400, undefined, msg, details),
  internalServerError: (msg: string, error?: Error | any, details?: any) => createResponse('fail', 500, msg, error, details),
  notFound: (msg?: string, data?: any) => createResponse('fail', 404, data, msg),
  success: (data?: any, code?: number, details?: any) => createResponse('success', code ?? 200, data, undefined, details),
}

// Implementation
export const insertSingleObject = async <T extends Document>(
  object: T,
  coll: Collection<T> | undefined,
  objectName: string,
): Promise<Report> => {
  try {
    if (!coll) {
      return responses.internalServerError(`Mongo ${objectName} collection not available`);
    }

    const id = await coll.insertOne(object);
    return responses.success({ id });
  } catch (error) {
    console.error(error);
    return responses.internalServerError(`Could not store document ${objectName}`, error);
  }
};

export const getSingleObjectById = async <T extends Document>(
  id: string,
  coll: Collection<T> | undefined,
  objectName: string,
): Promise<Report> => {
  try {
    if (!coll) {
      return responses.internalServerError(`Mongo ${objectName} collection not available`);
    }
    if (!id) {
      return responses.badRequest('No id provided');
    }
    if (id.length !== 24) {
      return responses.badRequest('Id length is in the incorrect format: too long');
    }
    const data = await coll.findOne({ _id: new Bson.ObjectId(id) });
    if (!data) {
      return responses.notFound(`Resource of type ${objectName} with id ${id} could not be found`);
    }

    return responses.success(data);
  } catch (error) {
    console.error(error);
    return responses.internalServerError(`Could not update document of type ${objectName}`, error);
  }
};

export const updateSingleObject = async <T extends Document>(
  object: T,
  coll: Collection<T> | undefined,
  objectName: string,
): Promise<Report> => {
  try {
    if (!coll) {
      return responses.internalServerError(`Mongo ${objectName} collection not available`);
    }

    const { id } = object;
    const fetchedDoc = await coll.findOne({ _id: { $oid: id } });

    if (!fetchedDoc) {
      return responses.notFound(`Resource of type ${objectName} with id ${id} could not be found`);
    }
    const { matchedCount } = await coll.updateOne(
      { _id: { $oid: id } },
      object,
    );
    if (matchedCount) {
      return responses.success(object, 204);
    } else {
      return responses.internalServerError('Object did not persist', { object });
    }
  } catch (error) {
    console.error(error);
    return responses.internalServerError(`Could not update document of type ${objectName}`, error);
  }
};

export const getObjects = async <T extends Document>(
  coll: Collection<T> | undefined,
  objectName: string,
  filter: Filter<T> = {},
): Promise<Report> => {
  try {
    if (!coll) {
      return responses.internalServerError(`Mongo ${objectName} collection not available`);
    }
    const allObjects = await coll.find(filter).toArray();
    if (allObjects.length === 0) {
      return responses.notFound(undefined, []);
    }

    return responses.success(allObjects);
  } catch (error) {
    console.error(error);
    return responses.internalServerError(`Could not retrieve document(s) of type ${objectName}`, error);
  }
};

export const deleteObjects = async <T extends Document>(
  coll: Collection<T> | undefined,
  objectName: string,
  filter: Filter<T>,
): Promise<Report> => {
  try {
    if (!coll) {
      return responses.internalServerError(
        `Mongo ${objectName} collection not available`,
      );
    }

    const deleteCount = await coll.delete(filter);
    if (deleteCount > 0) {
      return responses.success(undefined, undefined, { deleteCount });
    } else {
      return responses.notFound();
    }
  } catch (error) {
    console.error(error);
    return responses.internalServerError(`Could not delete document(s) of type ${objectName}`, error);
  }
};
