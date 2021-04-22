import { gql } from 'https://deno.land/x/oak_graphql/mod.ts';

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

// type PDFMetaData {
//   title: String
//   author: String
//   subject: String
//   creator: String
//   keywords: String
//   creationDate: String
//   modificationDate: String
// }

// metaData: {
//   pdf:
//   PDFMetaData;
// }

// type Query {
//   fetchDocument(id: ID): Document
// }

// # type UserOutput {
// #   id: Int
// # }


// # type Mutation {
// #   insertUser(first_name: String!, last_name: String!): UserOutput!
// # }

export default schema;
