import { Context} from "oak/mod.ts";
import { basename } from "std/path/mod.ts";
import { multiParser } from "multiparser/mod.ts";
import type { FormFile } from "multiparser/mod.ts";
import { crc32 } from "crc32/mod.ts";
import mongoClient from "../clients/mongo.ts";
import rabbitMqClient from '../clients/rabbitMq.ts';
import fileRepoClient from '../clients/fileRepo.ts';

const saveDoc = async (file: FormFile | undefined) => {
  const document = mongoClient.models.document.collection;
  if (!file || !document) {
    return;
  }
  const origFileName = basename(file.filename);
  const storedPath = await fileRepoClient.store(file.filename, file.content);
  const crc32Hash = crc32(file.content);

  const doc = {
    title: origFileName,
    storedPath,
    sizeBytes: file.size,
    contentType: file.contentType,
    crc32: crc32Hash,
    metaData: {
      originalFileName: origFileName,
    },
    modifiedDate: new Date().getTime(),
  };
  const dbDoc = await document.insertOne(doc);
  const id = JSON.parse(JSON.stringify(dbDoc));
  console.dir(id);

  const rabbitResp = await rabbitMqClient.publish('document.unprocessed', {
    id,
  });
  console.dir(rabbitResp);
};

export const uploadDoc = async ({request, response}: Context) => {
  const form = await multiParser(request.serverRequest);
  const files = form?.files?.files as FormFile | FormFile[] | undefined;
  const fileArray = Array.isArray(files)? files : [files];
  const docs = await Promise.all(fileArray.map(f => saveDoc(f)));
  console.log(docs);

  response.redirect('/upload?result=success');
};
