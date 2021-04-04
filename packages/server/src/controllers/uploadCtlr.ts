import { Context } from "https://deno.land/x/oak/mod.ts";
import { FormFile, multiParser } from 'https://deno.land/x/multiparser@v2.0.3/mod.ts';
import config from '../../../config/src/index.ts';
import * as path from 'https://deno.land/std@0.92.0/path/mod.ts';
import { v4 } from 'https://deno.land/std@0.92.0/uuid/mod.ts';
import { Document } from '../db/models/document.ts';
import { ensureDir } from 'https://deno.land/std@0.92.0/fs/mod.ts';
import { crc32 } from 'https://deno.land/x/crc32/mod.ts';
import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';

const randomNum = (base: number, digits: number): string => {
  const range = Math.pow(base, digits);
  const num = Math.round( Math.random() * range );
  const hex = num.toString(base);
  return hex;
};

const getMetaData = async (contentType: string, content: Uint8Array) => {
  if (contentType === 'application/pdf') {
    // Load a PDFDocument without updating its existing metadata
    const pdfDoc = await PDFDocument.load(content, {
      updateMetadata: false,
    });

    return {
      pdf: {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        creator: pdfDoc.getCreator(),
        keywords: pdfDoc.getKeywords(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
      }
    };
  }
  return {};
};

const saveDoc = async (file: FormFile | undefined) => {
  if (!file) {
    return;
  }
  const uuid = v4.generate();
  const ext = path.extname(file.filename);
  const origFileName = path.basename(file.filename);
  const bucket = randomNum(16, 2);
  const fileName = `${uuid}${ext}`;
  const savePath = path.resolve(config.server.uploadBasePath, `${bucket}/`, fileName);

  console.log(`Saving '${origFileName}' to '${savePath}'`);
  await ensureDir(path.resolve(config.server.uploadBasePath, `${bucket}/`));
  await Deno.writeFile(savePath, file.content);

  const crc32Hash = crc32(file.content);
  const metaData = await getMetaData(file.contentType, file.content);
  console.dir(metaData);

  const doc = {
    title: origFileName,
    storedPath: `${bucket}/${fileName}`,
    sizeBytes: file.size,
    contentType: file.contentType,
    crc32: crc32Hash,
    metaData: {
      originalFileName: origFileName,
      ...metaData,
    },
    modifiedDate: new Date().getTime(),
  };
  await Document.insertOne(doc);
};

export const uploadDoc = async ({request, response}: Context) => {
  const form = await multiParser(request.serverRequest);
  const files = form?.files?.files as FormFile | FormFile[] | undefined;
  if (Array.isArray(files)) {
    files.forEach(f => saveDoc(f));
  } else if (files) {
    saveDoc(files);
  }

  response.redirect('/upload');
};
