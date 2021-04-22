import { Context } from "oak/mod.ts";
import { Bson } from "mongo/mod.ts";
import { resolve } from "std/path/mod.ts";
import { createObject, deleteObjectById, getObjectById, getObjects, updateObject, respond } from "./helpers.ts";
import config from "config/mod.ts";
import mongoClient from "../clients/mongo.ts";

const document = mongoClient.models.document;

export const createDoc = async (ctx: Context) => {
  await createObject(ctx, document.collection);
};

export const getDocById = async (ctx: Context) => {
  await getObjectById(ctx, document.collection);
}

export const updateDoc = async (ctx: Context) => {
  await updateObject(ctx, document.collection);
};

export const getDocs = async (ctx: Context) => {
  await getObjects(ctx, document.collection);
};

export const deleteDocById = async (ctx: Context) => {
  await deleteObjectById(ctx, document.collection);
};

export const getDocContentById = async({ response, params }: Context | any) => {
  const collection = document.collection;
  if (!collection) {
    respond(response, 500, null, 'Service not initiated');
    return;
  }
  if (!params.id) {
    respond(response, 400, null, 'No id parameter was received');
    return;
  }
  if (params.id.length !== 24) {
    respond(response, 400, null, 'Id must be 12 bytes long');
    return;
  }
  const doc = await collection.findOne({ _id: new Bson.ObjectId(params.id) });
  if (!doc) {
    respond(response, 404, null, `Resource with id ${params.id} could not be found`);
    return;
  }

  const filePath = resolve(config.server.uploadBasePath, doc.storedPath);
  console.log(filePath);
  const fileCont = await Deno.readFile(filePath);
  response.type = doc.contentType;
  response.body = fileCont;
  response.status = 200;
};
