import MyListModel from "../models/myList.model.js";
import { userDetails } from "./user.controller.js";

export const addToMyListController = async (request, response) => {
    try {

        const userId = request.userId // middleware
        const { productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount
        } = request.body;

        const item = await MyListModel.findOne({
            userId: userId,
            productId: productId
        })

        if (item) {
            return response.status(400).json({
                message: "Item already in my list"
            })
        }

        const myList = new MyListModel({
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount,
            userId
        })

        const save = await myList.save();

        return response.status(200).json({
            message: "The product saved in my list",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const deleteToMyListController = async (request, response) => {
    try {

        const myListItem = await MyListModel.findById(request.params.id);

        if (!myListItem) {
            return response.status(404).json({
                message: "The  item with this given id is not found",
                error: true,
                success: false
            })
        }

        const deleteItem = await MyListModel.findByIdAndDelete(request.params.id);

        if (!deleteItem) {
            return response.status(404).json({
                message: "The item is not deleted",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            message: "The item removed from my List",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}



export const getMyListController = async (request, response) => {
    try {


        const userId = request.userId;
        
        const myListItem = await MyListModel.find({
            userId : userId
        });

        

        return response.status(200).json({
            error: false,
            success: true,
            data : myListItem
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}