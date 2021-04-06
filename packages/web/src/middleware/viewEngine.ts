import {viewEngine, engineFactory, adapterFactory} from '../../deps.ts';

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

export default viewEngine(oakAdapter, ejsEngine);
