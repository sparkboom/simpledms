import db from '../mongoClient.ts';

// Types
interface DocumentSchema {
  _id: { $oid: string };
  title: string;
  storedPath: string;
  sizeBytes: number;
  contentType: string;
}

const Document = db.collection<DocumentSchema>("documents");

const insert = async (doc: Omit<DocumentSchema, '_id'>) => Document.insertOne(doc);
const findOne = async (id: string) => Document.findOne({ _id: id });
const getAll = async () => Document.find();

export {
  Document,
  insert,
  findOne,
  getAll,
};
