import { _, __dirname, resolve } from './deps.ts';

const getConfig = (filename: string) => {
  const confPath = resolve(__dirname, `./config/${filename}`);
  console.log(`Loading configuration ${confPath}`);
  return JSON.parse(Deno.readTextFileSync(confPath));
};

const config = getConfig('config.json');
const secrets = getConfig("secrets.json");
const fullConfig = _.merge({}, config, secrets);
console.dir(secrets);

export const safeConfig = config;
export default fullConfig;
