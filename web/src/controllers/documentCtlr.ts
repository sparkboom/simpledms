import { Context, Body, Response } from "oak/mod.ts";
import * as docDomain from '../domain/document.ts';
import * uploadDomain from '../domain/upload.ts';
import { ld } from 'deno_lodash/mod.ts';

// Helpers
const respond = (response: Response, status: number, data: any, message?: string) => {
  response.status = status;
  response.body = {
    status: (status>=200 && status <300)? 'ok' : 'fail',
    data,
    message,
  };
};

const validateBody = (body: Body, response: Response) => {
  if (ld.isEmpty(body)) {
    respond(response, 404, null, 'No data provided');
    return false;
  }

  return true;
};

// Controllers
export const createDoc = async ({ request, response }: Context): Promise<void>=> {
  const body = await request.body();
  if (!validateBody(body, response)) {
    return;
  }
  // how should we validate incoming body?
  // OpenAPI and generate a validator?

  // if doc object contains an id, then use docDomain.updateDoc
  const {code, error, details} = await docDomain.createDoc(await body.value);
  respond(response, code, details, error);
};

// TODO: get typing for params, using any here to deal with incomplete type
export const getDocById = async ({ params, response }: Context | any): Promise<void> => {
  const {code, error, data} = await docDomain.getDocById(params.id);
  respond(response, code, data, error);
}

export const updateDoc = async ({ request, response }: Context): Promise<void> => {
  const body = await request.body();
  if (!validateBody(body, response)) {
    return;
  }
  const {code, error, details} = await docDomain.updateDoc(await body.value);
  respond(response, code, details, error);
};

export const getDocs = async ({ response }: Context): Promise<void> => {
  const {code, error, data} = await docDomain.getAllDocs();
  respond(response, code, data, error);
};

export const deleteDocById = async ({ params, response }: Context | any): Promise<void> => {
  const {code, error, details} = await docDomain.deleteDocById(params.id);
  respond(response, code, details, error);
};

export const getDocContentById = async({ response, params }: Context | any): Promise<void> => {
  const {code, error, data, details} = await docDomain.getDocContentById(params.id);
  response.code = code;
  response.body = data;
};

export const uploadDoc = async ({ request, response }: Context) => {
  const body = await request.body({ type: 'form-data'})
  const data = await body.value.read();
  const files = data.files ?? [];
  const reports = await Promise.all(files.map((f) => docDomain.uploadDoc(f)));
  const fileUploads =  reports
    .filter(r => r.status === 'success')
    .map(r => r.data);
  await uploadDomain.createUpload(fileUploads);

  if (data) {
    response.redirect('/upload?result=success');
  }
};
