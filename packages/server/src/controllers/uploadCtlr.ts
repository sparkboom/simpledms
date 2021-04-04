import { Context } from "https://deno.land/x/oak/mod.ts";
import { FormFile, multiParser } from 'https://deno.land/x/multiparser@v2.0.3/mod.ts';
import config from "../../../config/src/index.ts";
import * as path from "https://deno.land/std@0.92.0/path/mod.ts";
import "https://deno.land/x/lodash@4.17.19/dist/lodash.js";
import { v4 } from "https://deno.land/std@0.92.0/uuid/mod.ts";
import { Document } from '../db/models/document.ts';
import { ensureDir } from "https://deno.land/std@0.92.0/fs/mod.ts";
import { crc32 } from "https://deno.land/x/crc32/mod.ts";

const saveDoc = async (file: FormFile | undefined) => {
  if (!file) {
    return;
  }
  const uuid = v4.generate();
  const ext = path.extname(file.filename);
  const title = path.basename(file.filename);
  const fileName = `${uuid}${ext}`;
  const savePath = path.resolve(config.server.uploadBasePath, fileName);

  console.log('savePath', savePath);
  console.log("title", title);
  await ensureDir(config.server.uploadBasePath);
  await Deno.writeFile(savePath, file.content);

  const crc32Hash = crc32(file.content);

  const doc = {
    title: title,
    storedPath: fileName,
    sizeBytes: file.size,
    contentType: file.contentType,
    crc32: crc32Hash,
  };
  console.dir(doc);
  await Document.insertOne(doc);
};

export const uploadDoc = async ({request, response}: Context) => {
  const form = await multiParser(request.serverRequest);
  if (form) {
    console.dir(form);
  }
  const files = form?.files?.files as FormFile | FormFile[] | undefined;
  if (Array.isArray(files)) {
    files.forEach(f => saveDoc(f));
  } else if (files) {
    saveDoc(files);
  }

  response.redirect('/');
};
