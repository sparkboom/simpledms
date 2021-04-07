import dirname from 'dirname/mod.ts';
import 'lodash';

const _ = (self as any)._;
const { __dirname } = dirname(import.meta);

export {
  _,
  __dirname,
};
