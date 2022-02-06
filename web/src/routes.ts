import { Router, Context } from 'oak/mod.ts';
import { createDoc, getDocs, getDocContentById, getDocById, updateDoc, deleteDocById, uploadDoc} from './controllers/documentCtlr.ts';
import { getStatus, getStatusDetailed } from './controllers/statusCtlr.ts';
const router = new Router();

router
  .post('/documents/upload', uploadDoc)
  .get('/documents/:id', getDocById)
  .get('/documents/:id/content', getDocContentById)
  .get('/documents', getDocs)
  .post('/documents', createDoc)
  .put('/documents/:id', updateDoc)
  .delete('/documents/:id', deleteDocById)

  .get('/status', getStatus)
  .get('/status/detailed', getStatusDetailed)

  .get('/upload', (ctx: Context | any) => {ctx.render('web/src/views/upload.ejs')});

export default router;
