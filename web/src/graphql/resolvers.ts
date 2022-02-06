import { Bson } from "mongo/mod.ts";
import { getDocument } from "../clients/mongo.ts";

const resolvers = {
  Query: {
    document: async (parent: any, { id }: any, context: any, info: any) => {

      // if (id.length !== 24 ) {
      //   response.body = { status: 'fail', data: null, message: 'Id must be 12 bytes long' };
      //   response.status = 400;
      //   return;
      // }
      const document = getDocument();
      if (!document) {
        return {};
      }
      const val = await document.findOne({ _id: new Bson.ObjectId(id) });
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
