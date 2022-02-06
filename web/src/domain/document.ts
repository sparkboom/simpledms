import { DDDocument, getDocument } from "../clients/mongo.ts";
import * as common from './common.ts';
import type { FormDataFile } from "oak/mod.ts";
import { amqpDocClient } from "../clients/amqp.ts";
import fileClient from "../clients/file.ts";
import { StoredFiled } from "../clients/file/DDFileClient.ts";
export { v4 } from 'std/uuid/mod.ts';

// Types
type Report = common.Report;

// Implementation
export const createDoc = async (doc: any): Promise<Report> => {
  const coll = getDocument();
  return await common.insertSingleObject(doc, coll, 'document');
};

export const updateDoc = async (doc: any): Promise<Report> => {
  const coll = getDocument();
  return await common.updateSingleObject(doc, coll, 'document');
};

export const getDocById = async (id: any): Promise<Report> => {
  const coll = getDocument();
  return await common.getSingleObjectById(id, coll, 'document');
};

export const getAllDocs = async (): Promise<Report> => {
  const coll = getDocument();
  return await common.getObjects(coll, 'document');
};

// export const getDocs = async (): Promise<Report> => {
//   const coll = getDocument();
//   return await common.getObjects(coll, 'document', { filter goes here });
// };

export const deleteDocById = async (id: any): Promise<Report> => {
  const coll = getDocument();
  return await common.deleteObjects(coll, 'document', { _id: { $oid: id } });
};

export const getDocContentById = async (
  id: any
): Promise<Report> => {
  // TODO: try catch block
  const coll = getDocument();
  const report = await common.getSingleObjectById(id, coll, 'document');
  if (report.status === 'fail') {
    return report;
  }

  const doc: DDDocument = report.data;
  // const repo = doc.process.indexed ? 'documents' : 'uploads';
  const docContent = await fileClient.retrieveFileContent('uploads', doc._id.$oid, doc.fileE);
  return common.responses.success(docContent);
};

export const uploadDoc = async(file: FormDataFile) => {
  let upload: StoredFiled | null = null;
  try {
    if (!file) {
        return common.responses.badRequest('An empty file was uploaded');
    }

    const coll = getDocument();
    if (!coll) {
      return common.responses.internalServerError(`Mongo document collection not available`);
    }

    const uploadReport = await fileClient.storeFormFile('uploads', file);
    if (uploadReport.status === 'fail' || !uploadReport.data) {
      return common.responses.internalServerError('Document could not be saved', uploadReport.error)
    }
    upload = uploadReport.data;
    await createDoc({
      _id: { $oid: upload.key },
      sizeBytes: upload.sizeByes,
      crc32Hash: upload.crc32Hash,
      title: upload.originalFileName,
      contentType: upload.contentType,
      metaData: {
        originalFileName: upload.originalFileName,
      },
      creationDate: new Date().getTime(),
      modifiedDate: new Date().getTime(),
    });
    await amqpDocClient.postNewDocument(upload.key);
    return common.responses.success({
      status: 'ok',
      documentKey: upload.key,
      sizeBytes: upload.sizeByes,
      crc32Hash: upload.crc32Hash,
      originalFileName: upload.originalFileName,
      contentType: upload.contentType,
    });
  } catch (err) {
    console.error(err);
    return common.responses.internalServerError('There was an error when uploading/saving documents', err, {
      status: 'fail',
      error: err,
      documentKey: upload?.key,
      sizeBytes: upload?.sizeByes,
      crc32Hash: upload?.crc32Hash,
      originalFileName: file.originalName,
      contentType: file.contentType,
    });
  }
};
