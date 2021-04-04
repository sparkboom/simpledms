import {viewEngine, engineFactory, adapterFactory} from 'https://deno.land/x/view_engine/mod.ts';

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

export default viewEngine(oakAdapter, ejsEngine);
