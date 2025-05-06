import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required : true
        }
    ],

    price: {
        type: Number,
        default: 0
    },
    oldPrice:{
        type: Number,
        default: 0
    },
    catName: {
        type: String,
        default : ''
    },
    catId:{
         type: String,
        default : ''
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',     
    },
    rating:{
        type: Number,
        default : 0
    },
    discount:{
        type : Number,
        required: true
    },
   
    dateCreated:{
        type: Date,
        default: Date.now
    },


},{
    timestamps: true
});

const ProductModel = mongoose.model('product', productSchema)
export default ProductModel;