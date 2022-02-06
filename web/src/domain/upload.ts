import { DDUpload, DDUploadFile, getUpload } from "../clients/mongo.ts";
import * as common from './common.ts';
import { insertSingleObject } from "./common.ts";

export const createUpload = async (reports: DDUploadFile[]) => {
  const coll = getUpload();
  if (!coll) {
    return common.responses.internalServerError(`Mongo document collection not available`);
  }

  const upload: DDUpload = {
    files: reports,
    creationDate: new Date().getTime(),
    modifiedDate: new Date().getTime(),
  };

  await insertSingleObject<DDUpload>(upload, coll, 'upload');
};
