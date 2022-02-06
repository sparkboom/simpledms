import { Document } from 'mongo/mod.ts';
import DDMongoClient from './mongo/DDMongoClient.ts';
import config from 'config/mod.ts';

const client = new DDMongoClient(config.server.db);
const { maxRetries, retryIntervalMs } = config.server.db.connection;
try{
  client.connect(maxRetries, retryIntervalMs);
} catch (err) {
  console.error(err);
}

export default client;

// Schemas/Collections
type DDDocumentMetaData = Record<string, any>;
export interface DDDocument extends Document {
  _id?: { $oid: string };
  title: string;
  sizeBytes: number;
  contentType: string;
  crc32Hash: string;
  fileExtension: string;
  metaData: DDDocumentMetaData;
  creationDate: number;
  modifiedDate: number;
}

export interface DDUploadFile {
  originalFileName: string;
  sizeBytes: number;
  documentKey: string;
  status: 'fail',
  error: any,
  crc32Hash: string;
  contentType: string;
}

export interface DDUpload extends Document {
  _id?: { $oid: string };
  files: DDUploadFile[];
  creationDate: number;
  modifiedDate: number;
}

export const getDocument = () => client.db?.collection<DDDocument>('documents');
export const getUpload = () => client.db?.collection<DDUpload>('uploads');
