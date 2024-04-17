import mongoose from "mongoose";

const collectionName = 'carts'

const cartSchema = new mongoose.Schema({
    products:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity:{
            type: Number,
            required:true
        }
    }]
})

//creo y exporto la clase con la cual voy a interacturar con la coleccion.
export const CartModel = new mongoose.model(collectionName,cartSchema)
