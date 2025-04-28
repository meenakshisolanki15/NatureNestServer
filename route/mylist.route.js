import {Router} from 'express';
import auth from '../middleware/auth.js';
import uplaod from '../middleware/multer.js';
import { addToMyListController, deleteToMyListController, getMyListController } from '../controllers/mylist.controller.js';

const myListRouter = Router();

myListRouter.post('/add', auth, addToMyListController);
myListRouter.delete('/:id', auth, deleteToMyListController);
myListRouter.get('/', auth, getMyListController);





export default myListRouter;