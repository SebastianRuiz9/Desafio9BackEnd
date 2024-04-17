import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'products'

const productSchema = new mongoose.Schema({
    title: { 
        type:String,
        required: true
    },
    description: { 
        type:String,
        required: true
    },
    price: { 
        type:String,
        required: true
    },
    img: { 
        type:String,
        required: true
    },
    code: { 
        type:String,
        required: true,
        unique:true
    },
    category: { 
        type:String,
        required: true
    },
    stock: { 
        type:Number,
        required: true
    },
 
    status: { 
        type:Boolean,
        required: true
    },
    thumbnails: { 
        type:[String],
        //required: true
    },
    
})

//Le agrego el plugin para paginate.
productSchema.plugin(mongoosePaginate)
//creo y exporto la clase con la cual voy a interacturar con la coleccion.
export const ProductModel = new mongoose.model(collectionName,productSchema)