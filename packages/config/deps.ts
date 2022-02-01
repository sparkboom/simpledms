import 'https://deno.land/x/lodash@4.17.19/dist/lodash.js';
import dirname from 'https://deno.land/x/dirname@1.1.2/mod.ts';

const _ = (self as any)._;
const { __dirname } = dirname(import.meta);

export {
  _,
  __dirname,
};
