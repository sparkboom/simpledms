import * as path from "https://deno.land/std@0.92.0/path/mod.ts";
import __ from "https://deno.land/x/dirname/mod.ts";
import "https://deno.land/x/lodash@4.17.19/dist/lodash.js";

const _ = (self as any)._;
const { __dirname } = __(import.meta);

const configPath = path.resolve(__dirname, '../config/config.json');
const config = JSON.parse(Deno.readTextFileSync(configPath));
const secretsPath = path.resolve(__dirname, "../config/secrets.json");
const secrets = JSON.parse(Deno.readTextFileSync(secretsPath));
const fullConfig = _.merge({}, config, secrets);

export const safeConfig = config;

export default fullConfig;
