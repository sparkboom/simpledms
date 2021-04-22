import { adapterFactory, engineFactory, viewEngine } from "view_engine/mod.ts";

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

export default viewEngine(oakAdapter, ejsEngine);
