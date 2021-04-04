import { dmsDb } from '../mongoClient.ts';

// Types
interface PDFMetaData {
  title: string;
  author: string;
  subject: string;
  creator: string;
  keywords: string;
  creationDate: string;
  modificationDate: string;
};
interface DocumentSchema {
  _id: { $oid: string };
  title: string;
  storedPath: string;
  sizeBytes: number;
  contentType: string;
  crc32: string;
  metaData: {
    pdf?: Partial<PDFMetaData>;
  };
}

const Document = dmsDb.collection<DocumentSchema>("documents");

export {
  Document,
};
