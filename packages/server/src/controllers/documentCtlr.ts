import { Document } from '../db/models/document.ts';
import { Context } from "https://deno.land/x/oak/mod.ts";
import { createObject, deleteObjectById, getObjectById, getObjects, updateObject } from "./helpers.ts";

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
