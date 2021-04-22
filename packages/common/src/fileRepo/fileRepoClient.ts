import { basename, extname, resolve, v4, ensureDir, join } from '../../deps.ts';

// Types
interface FileRepoConfig {
  repoBasePath: string;
}

// Helpers
const randomNum = (base: number, digits: number): string => {
  const range = Math.pow(base, digits);
  const num = Math.round(Math.random() * range);
  const hex = num.toString(base);
  return hex;
};

// Client
export default class FileRepoClient {
  private _config: FileRepoConfig | null = null;

  constructor (config: FileRepoConfig) {
    this._config = config;
  }

  async store(originalFilePath: string, content: Uint8Array): Promise<string> {
    if (!this._config) {
      throw new Error('FileRepoClient: Cannot store, no configuration set');
    }
    const uuid = v4.generate();
    const ext = extname(originalFilePath;);
    const origFileName = basename(originalFilePath;);
    const bucket = randomNum(16, 2);
    const fileName = `${uuid}${ext}`;
    const savePath = resolve(this._config.repoBasePath, `${bucket}/`, fileName);

    console.log(`Saving '${origFileName}' to '${savePath}'...`);
    await ensureDir(resolve(this._config.repoBasePath, `${bucket}/`));
    await Deno.writeFile(savePath, content);
    console.log(`Saved '${savePath}'`);

    const storeKey = join(bucket, fileName);
    return storeKey;
  }

  async acquire(storeKey: string): Promise<Uint8Array> {
    if (!this._config) {
      throw new Error('FileRepoClient: Cannot acquire file, no configuration set');
    }
    console.log(`Retrieving content '${storeKey}'...`);
    const readPath = resolve(this._config.repoBasePath, storeKey);
    const content = await Deno.readFile(readPath);
    console.log(`Retrieved content '${storeKey}'`);
    return content;
  }
}
