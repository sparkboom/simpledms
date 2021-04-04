import { Router, Context } from 'https://deno.land/x/oak/mod.ts';
import { createDoc, getDocs, getDocById, updateDoc, deleteDocById} from './controllers/documentCtlr.ts';
import { uploadDoc } from './controllers/uploadCtlr.ts';
const router = new Router();
router
  .get('/', (ctx: Context | any) => {ctx.render('src/views/upload.ejs')})
  .post('/upload', uploadDoc)
  .get('/document/:id', getDocById)
  .get('/documents', getDocs)
  .post('/documents', createDoc)
  .put('/documents/:id', updateDoc)
  .delete('/document/:id', deleteDocById);
export default router;
