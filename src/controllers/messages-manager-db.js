import { MessageModel } from "../models/message.model.js"

export class MessagesManager{

    async saveMessage(user,message){
        //Crea en  la base de datos el registro del mensaje del user y le pone un timestamp.
        try {
            const newMessage = MessageModel({user,message})
            newMessage.save()
            return newMessage
        } catch (error) {
            
        }
    
    }

    async getMessages(){
        //devuelve la lista de mensajes en la conversacion.
        try{
            const messages = await MessageModel.find()
            return messages
        }
        catch(error){
            console.log(error)
        }
       
    }
}