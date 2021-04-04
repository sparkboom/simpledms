import { Router, Context } from 'https://deno.land/x/oak/mod.ts';
import { createDoc, getDocs, getDocContentById, getDocById, updateDoc, deleteDocById} from './controllers/documentCtlr.ts';
import { getStatus, getHealth } from './controllers/statusCtlr.ts';
import { uploadDoc } from './controllers/uploadCtlr.ts';
const router = new Router();
router
  .get('/upload', (ctx: Context | any) => {ctx.render('src/views/upload.ejs')})
  .get('/health', getHealth)
  .get('/status', getStatus)
  .post('/documents/upload', uploadDoc)
  .get('/documents/:id', getDocById)
  .get('/documents/:id/content', getDocContentById)
  .get('/documents', getDocs)
  .post('/documents', createDoc)
  .put('/documents/:id', updateDoc)
  .delete('/documents/:id', deleteDocById);
export default router;
