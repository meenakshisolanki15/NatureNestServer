import {Router} from 'express';
import auth from '../middleware/auth.js';
import { addToCartItemController, deleteCartItemController, getCartItemController, UpdateCartItemController } from '../controllers/cart.controller.js';


const cartRouter = Router();

cartRouter.post('/add',auth, addToCartItemController);
cartRouter.get('/get',auth, getCartItemController);
cartRouter.put('/update-qty',auth, UpdateCartItemController);
cartRouter.delete('/delete-cart-item',auth, deleteCartItemController);



export default cartRouter;