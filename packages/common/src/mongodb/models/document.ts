import { Database, Collection } from '../../../deps.ts';

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

export interface DocumentSchema {
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

export default class Document {
  private _db: Database | null = null;
  private _collection: Collection<DocumentSchema> | null = null;

  constructor(db?: Database | null) {
    this._db = db ?? null;
  }

  get isReady() {
    return !!this._db;
  }

  get collection() {
    return this._collection;
  }

  set db (db: Database) {
    this._db = db;
    this._collection = this._db.collection<DocumentSchema>('documents');
  }
}
