import * as path from "https://deno.land/std@0.92.0/path/mod.ts";
import __ from "https://deno.land/x/dirname/mod.ts";
import "https://deno.land/x/lodash@4.17.19/dist/lodash.js";

const _ = (self as any)._;
const { __dirname } = __(import.meta);

const getConfig = (filename: string) => {
  const confPath = path.resolve(__dirname, `../config/${filename}`);
  return JSON.parse(Deno.readTextFileSync(confPath));
};

const config = getConfig('config.json');
const secrets = getConfig("secrets.json");
const fullConfig = _.merge({}, config, secrets);

export const safeConfig = config;
export default fullConfig;
