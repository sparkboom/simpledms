import { gql } from "oak_graphql/mod.ts";

const schema = gql`
type PDFMetaData {
  title: String
  author: String
  subject: String
  creator: String
  keywords: String
  creationDate: String
  modificationDate: String
}

type MetaData {
  pdf: PDFMetaData
}

type Document {
  id: ID!
  title: String
  storedPath: String
  sizeBytes: String
  contentType: String
  metaData: MetaData
}

type Query {
  document(id: ID!): Document
}
`;

export default schema;
