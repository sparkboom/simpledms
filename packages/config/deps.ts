export { resolve } from 'https://deno.land/std@0.92.0/path/mod.ts';
import __ from 'https://deno.land/x/dirname/mod.ts';
import 'https://deno.land/x/lodash@4.17.19/dist/lodash.js';

const _ = (self as any)._;
const { __dirname } = __(import.meta);

export {
  _,
  __dirname,
};
