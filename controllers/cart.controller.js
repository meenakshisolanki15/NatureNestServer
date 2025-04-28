import { response } from "express";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async(request, response)=>{
    try{
        const userId = request.userId
        const { productId} = request.body

        if(!productId){
            return response.status(402).json({
                message: "Provide productId",
                error: true,
                success: false
            })
        }

        const checkItemCart  = await CartProductModel.findOne({
            userId : userId,
            productId : productId
        })

        if(checkItemCart){
            return response.status(400).json({
                message: "Item already in cart"
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })

        const save = await cartItem.save()

        const updateCartUser = await UserModel.updateOne({ _id : userId}, {
            $push : {
                shopping_cart : productId
            }
        })


        return  response.status(200).json({
            data:save,
            message: "Item added successfully",
            error: false,
            success: true
        })

    }catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const getCartItemController = async(request, response)=>{
    try{
        const userId = request.userId;
        const cartItem = await CartProductModel.find({
            userId : userId
        }).populate('productId')


        return response.status(200).json({ 
            data: cartItem,
            error: false,
            success: true
        })

    }catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const UpdateCartItemController = async(request, response)=>{
    try{
        const userId = request.userId
        const { _id,qty} = request.body

        if(!_id || !qty){
            return response.status(400).json({
                message:"provide _id , qty"
            })
        }

        const updateCartItem = await CartProductModel.updateOne(
            {
                _id: _id
            },
            {
                quantity: qty
            }
        )


        return response.status(200).json({ 
            message: "Update cart",
            data: updateCartItem,
            error: false,
            success: true
        })

    }catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCartItemController = async(request, response)=>{
    try{
        const userId = request.userId  // middleware
        const { _id, productId} = request.body

        if(!_id){
            return response.status(400).json({
                message:"provide _id",
                error:true,
                success: false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne(
            {
                _id: _id, userId:userId
            }
            
        )

        if(!deleteCartItem){
            return response.status(404).json({
                message:"The product in the cart is not found",
                error:true,
                success:false
            })
        }

        const user = await UserModel.findOne({
            _id:userId
        })

        const cartItems = user?.shopping_cart;
        const updatedUserCart = [...cartItems.slice(0, cartItems.indexOf(productId)), 
                                ...cartItems.slice(cartItems.indexOf(productId)+1)];



        user.shopping_cart = updatedUserCart;
        await user.save();

        return response.status(200).json({ 
            message: "Item remove",
            data: deleteCartItem,
            error: false,
            success: true
        })

    }catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
