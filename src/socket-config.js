import {Server} from 'socket.io'
import fsPromises from 'fs'
import { ProductManager } from "./controllers/product-manager-db.js"
import { MessagesManager } from "./controllers/messages-manager-db.js"

const productManager = new ProductManager()
const messagesManager = new MessagesManager()


function initSocket(serverReference){

    const io = new Server(serverReference)
        
    io.on("connection", async (socket)=>{
        //Envio los productos
        //Con este evento envio la lista de productos.
        socket.emit('eventProducts',await productManager.getProducts())

        //Cuando escuche el evento addProduct 
        socket.on('addProduct',async(productObject,fileNamePathInServer)=>{
            //Guardo el producto y uso el objeto con informacion que me devuelve addProduct 
            //Solo activo el evento 'eventProducts si salio todo OK'
            const responseAddProduct = await productManager.addProduct(productObject) //agrega pruducto
            //Ahora le mando al cliente 2 mensajes. EL mensaje del resultado y la lista de productos.
            if (responseAddProduct.success){
                socket.emit('resultAddMessage',responseAddProduct.message)
                //Falta subir la imagen a public  y eso sera escuchar un evento enviado desde realtimeproducts con la imagen cargada y nuevo nombre
                
                //podria en este punto subir la imagen al servidor.
                //hago la solicitud y obtengo el nombre del archivo
                //si todo sale OK mdodifico el registro en la BD

                socket.emit('eventProducts',await productManager.getProducts()) //manda lista
            }
            else{ //Si no se agrego el producto solo el mensaje y borro el archivo en mi server local.
                socket.emit('resultAddMessage',responseAddProduct.message)
                await fsPromises.unlink(process.cwd() + '/src/public/products/'  + fileNamePathInServer);
                //No hago eventProducts para no hacer solicitud innecesaria ya que el catalogo no cambio.
            }
        })

        //Cuando escuche deleteProducts.
        socket.on('deleteProduct',async(data)=>{
            //console.log('Id que llego: ',data)
            //Borra el producto de la BD pero si borramos el producto tmb necesito borrar su imagen de mi server
            const responseDeleteProduct = await productManager.deleteProduct(data) 
            if (responseDeleteProduct.success){
                //Si salio todo OK borro el archivo envio mensaje al cliente y luego le envio la nueva lista de productos
                await fsPromises.unlink(process.cwd() + '/src/public/'  + responseDeleteProduct.imgpath);
                socket.emit('resultDeleteMessage',responseDeleteProduct.message)
                socket.emit('eventProducts',await productManager.getProducts()) //manda lista
            }
            else{
                //Pero si algo fallo, o sea no se borro el producto porque no se encontro emito mensahe tambien.
                socket.emit('resultDeleteMessage',responseDeleteProduct.message)
        }

        

        })

            //Cuando escuche el evento addMessage
            socket.on('eventAddMessage',async(dataMessage)=>{
                console.log('Recibi en el server ', dataMessage)
                //Guarda el dato en la BD
                await messagesManager.saveMessage(dataMessage.user,dataMessage.message)
                //Una vez guardado el mensaje le mando al cliente la lista actualizada.
                socket.emit('eventMessages',await messagesManager.getMessages())
            })

    }) 

}



export { initSocket }