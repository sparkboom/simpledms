import { basename, extname, resolve } from 'std/path/mod.ts';
import type { FormDataFile } from "oak/mod.ts";
import { crc32 } from 'crc32/mod.ts';
import { ensureDir } from 'std/fs/mod.ts';

// Types
interface FileConfig {
  basePath: string;
  acceptedContentTypes: string[];
}
interface Report<T> {
  status: 'ok' | 'fail';
  data?: T;
  error?: Error;
}
export interface StoredFiled {
  key: string;
  originalFileName: string;
  crc32Hash: string;
  fileExtension: string;
  contentType: string;
  sizeByes: number;
}

// Client
export default class DDFileClient<R extends string> {
  private _config: FileConfig;

  constructor(config: FileConfig) {
    if (!config) {
      throw new Error('DDFileClient: No configuration set');
    }
    this._config = config;
  }

  private _constructPath(repoName: R, key?: string) {
    if (!key) {
      return resolve(this._config.basePath, `${repoName.toLowerCase()}/`);
    }
    const bucket1 = key?.substring(0,2);
    const bucket2 = key?.substring(2,4);
    const path = resolve(this._config.basePath, `${repoName.toLowerCase()}/`, `${bucket1}/`, `${bucket2}/`);
    return path;
  }

  private _constructFilePath(repoName: R, id: string, ext: string) {
    const path = resolve(this._constructPath(repoName, id), `${id}.${ext}`.toLowerCase());
    return path;
  }

  async storeFormFile(repoName: R, file: FormDataFile, key: string = globalThis.crypto.randomUUID()): Promise<Report<StoredFiled>> {
    try {
      if (!file.filename) {
        throw new Error('File does not have a filename');
      }
      if (!this._config.acceptedContentTypes.includes(file.contentType)) {
        throw new Error(`Content type ${file.contentType} not accepted`);
      }
      console.log(file.contentType);
      const fileExtension = extname(file.filename);
      const savePath = this._constructPath(repoName, key);
      const content = await Deno.readFile(file.filename);
      const crc32Hash = crc32(content);

      await ensureDir(savePath);

      const filePath = this._constructFilePath(repoName, key, fileExtension);

      await Deno.writeFile(filePath, content);
      await Deno.remove(file.filename);
      console.log(`DDFileClient: Saved '${savePath}'`);

      return {
        status: 'ok',
        data: {
          key,
          originalFileName: file.originalName,
          crc32Hash,
          fileExtension,
          contentType: file.contentType,
          sizeByes: content.length,
        }
      };
    } catch (err) {
      console.error(err);
      console.log(`DDFileClient: Store file failed '${err.message}'`);
      return {
        status: 'fail',
        error: err,
      }
    }
  }

  checkAccess() {
    try {
      const stat = Deno.statSync(resolve(this._config.basePath));
      if (!stat.isDirectory) {
        throw new Error('The storage path is not a directory');
      }
      // TODO: permissions check for current user
      return {
        status: 'ok',
        data: {
          repoPathExists: true,
          pid: Deno.pid
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'fail',
        error
      };
    }
  }

  async retrieveFileContent(repoName: R, key: string, fileExtension: string): Promise<Uint8Array> {
    const filePath = this._constructFilePath(repoName, key, fileExtension);
    console.log(`DDFileClient: Retrieving content '${key}'...`);
    const content = await Deno.readFile(filePath);
    console.log(`DDFileClient: Retrieved content '${key}'`);
    return content;
  }
}
