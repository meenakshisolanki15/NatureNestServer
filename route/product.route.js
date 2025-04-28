import {Router} from 'express';
import auth from '../middleware/auth.js';
import uplaod from '../middleware/multer.js';
import { createProduct, deleteProduct, getAllFeatured, getAllProduct, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, getProduct, getProductsCount, updateProduct, uploadImages } from '../controllers/product.Controller.js';
import { removeImageFromCloudinary } from '../controllers/category.controller.js';


const productRouter = Router();
productRouter.post('/uploadImages', auth,uplaod.array('images'), uploadImages);
productRouter.post('/create', auth, createProduct);
productRouter.get('/getAllProducts', getAllProduct);
productRouter.get('/getAllProductsByCatId/:id', getAllProductsByCatId);
productRouter.get('/getAllProductsByCatName', getAllProductsByCatName);
productRouter.get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId);
productRouter.get('/getAllProductsBySubCatName', getAllProductsBySubCatName);
productRouter.get('/getAllProductsByPrice', getAllProductsByPrice);
productRouter.get('/getAllProductsByRating', getAllProductsByRating);
productRouter.get('/getProductsCount', getProductsCount);
productRouter.get('/getAllFeatured', getAllFeatured);
productRouter.delete('/:id', deleteProduct);
productRouter.get('/:id', getProduct);
productRouter.delete('/deleteImage',auth, removeImageFromCloudinary);
productRouter.put('/updateProduct/:id',auth, updateProduct);




export default productRouter;