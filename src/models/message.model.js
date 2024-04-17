import mongoose from "mongoose";

const collectionName = 'messages'

const messageSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
      }
})

//creo y exporto la clase con la cual voy a interacturar con la coleccion.
export const MessageModel = new mongoose.model(collectionName,messageSchema)