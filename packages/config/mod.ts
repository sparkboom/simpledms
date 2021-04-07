import { _, __dirname } from './deps.ts';
import { resolve } from "std/path/mod.ts";

const getConfig = (filename: string) => {
  const confPath = resolve(__dirname, `./config/${filename}`);
  console.log(`Loading configuration ${confPath}`);
  return JSON.parse(Deno.readTextFileSync(confPath));
};

const config = getConfig('config.json');
const secrets = getConfig("secrets.json");
const fullConfig = _.merge({}, config, secrets);

export const safeConfig = config;
export default fullConfig;
