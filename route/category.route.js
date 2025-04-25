import {Router} from 'express';
import auth from '../middleware/auth.js';
import uplaod from '../middleware/multer.js';
import { createCategory, deletCategory, getCategories, getCategoriesCount, getCategory, getSubCategoriesCount, removeImageFromCloudinary, updatedCategory, uploadImages } from '../controllers/category.controller.js';


const categoryRouter = Router();

categoryRouter.post('/uploadImages',auth,uplaod.array('images'), uploadImages);
categoryRouter.post('/create',auth, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/get/count', getCategoriesCount);
categoryRouter.get('/get/count/subCat', getSubCategoriesCount);
categoryRouter.get('/:id', getCategory);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/deleteImage',auth, removeImageFromCloudinary)
categoryRouter.delete('/:id',auth, deletCategory);
categoryRouter.put('/:id',auth, updatedCategory);


export default categoryRouter;