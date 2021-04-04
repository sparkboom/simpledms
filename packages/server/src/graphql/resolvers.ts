import { Document } from '../db/models/document.ts';
import { Bson } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

const resolvers = {
  Query: {
    document: async (parent: any, { id }: any, context: any, info: any) => {

      // if (id.length !== 24 ) {
      //   response.body = { status: 'fail', data: null, message: 'Id must be 12 bytes long' };
      //   response.status = 400;
      //   return;
      // }
      const val = await Document.findOne({ _id: new Bson.ObjectId(id) });
      if (!val) {
        return {};
      }
      return {
        id: val._id,
        title: val.title,
        storedPath: val.title,
        sizeBytes: val.sizeBytes,
        contentType: val.contentType,
        metaData: val.metaData,
      };
    },
  },
};

export default resolvers;
