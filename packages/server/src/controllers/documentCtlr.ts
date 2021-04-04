import { Document } from '../db/models/document.ts';
import { Context } from "https://deno.land/x/oak/mod.ts";
import { createObject, deleteObjectById, getObjectById, getObjects, updateObject } from "./helpers.ts";
import { Bson } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import * as path from "https://deno.land/std@0.92.0/path/mod.ts";
import config from "../../../config/src/index.ts";

export const createDoc = async (ctx: Context) => {
  await createObject(ctx, Document);
};

export const getDocById = async (ctx: Context) => {
  await getObjectById(ctx, Document);
}

export const updateDoc = async (ctx: Context) => {
  await updateObject(ctx, Document);
};

export const getDocs = async (ctx: Context) => {
  await getObjects(ctx, Document);
};

export const deleteDocById = async (ctx: Context) => {
  await deleteObjectById(ctx, Document);
};

export const getDocContentById = async({ response, params }: Context | any) => {
  console.log('getDocContentById');
  if (!params.id) {
    response.body = {
      status: "fail",
      data: null,
      message: "No id parameter was received",
    };
    response.status = 400;
    return;
  }
  if (params.id.length !== 24) {
    response.body = {
      status: "fail",
      data: null,
      message: "Id must be 12 bytes long",
    };
    response.status = 400;
    return;
  }
  const doc = await Document.findOne({ _id: new Bson.ObjectId(params.id) });
  if (!doc) {
    response.body = {
      status: "fail",
      data: null,
      message: `Resource with id ${params.id} could not be found`,
    };
    response.status = 404;
    return;
  }

  const filePath = path.resolve(config.server.uploadBasePath, doc.storedPath);
  console.log(filePath);
  const fileCont = await Deno.readFile(filePath);
  response.type = doc.contentType;
  response.body = fileCont;
  response.status = 200;
};
