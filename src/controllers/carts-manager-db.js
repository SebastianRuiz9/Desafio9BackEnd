import { CartModel } from "../models/cart.model.js"
import mongoose from "mongoose"

export class CartsManager{

    async createCart(){
        //Crea un carrito en nuestra BD. Saliendo todo OK retorna el carrito creado.
        try {
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        } catch (error) {
            console.log('Error al crear carrito.',error)
            throw error
        }
    }

    async getCartById(id){
    /*Esta funcionretorna el carrito pasado por parametro y Retorna un objeto asi:
    {success: true/false, message: '', cart: carrito solicitado/null}*/
        try {
            //Si no es un ID valido de mongo salgo con success false.
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.log(`El valor proporcionado (${id}) no es un ObjectId válido.`);
                return {
                    success: false, 
                    message: `El valor proporcionado (${id}) no es un ObjectId válido.`, 
                    cart: null
                    }
            }
            //Busco el carro por id.
            const searchedCart = await CartModel.findById(id).populate('products.product')
         
            //Si no obtengo resultado salgo.
            if (!searchedCart){
                console.log(`No se encuentra un carrito con id ${id}.`) 
                return {
                    success: false, 
                    message: `No existe un carrito con el valor proporcionado (${id}).`, 
                    cart: null
                }
            }
            //Si obtengo resultado favorable devuelvo mi objeto con success,mensaje y carro.
            return {
                success: true, 
                message: `Operacion realizada con exito...`, 
                cart:searchedCart
            }
        } catch (error) {
            console.error('Error al obtener carrito por id.', error);
            return { 
                success: false, 
                message: 'Error al obtener carrito por id.', error, 
                cart: null 
            }
        }
    }

    
async addProductInCart(cartId,productId,quantity){
     /*Esta funcion agrega el  productId pasado por parametro al carrito pasado por parametro y Retorna un objeto asi:
    {success: true/false, message: '', cart: carrito actualizado/null}*/
    //En este caso tmb deberiamos ver que productId es valido ya que estamos con mongo
    //Busco el carrito donde voy a agregar el producto y la cantidad.
    try{
        const response = await this.getCartById(cartId)
        //Si no encontro el carrito o hubo un error salimos mostrando el mensaje correspondiente.
        if (!response.success){
            return {
                success: false, 
                message: response.message, //Enviamos el mensaje que nos dio getCartById
                cart: null
                }
        }
        else{//Si se encontro el carrito vamos a proceder a agregar el nuevo producto y/o actualizar la cantidad.
            const searchedCart = response.cart //Trabajo con searchedCart por comodidad
            const existProductInCart = searchedCart.products.some(item => item.product._id == productId )
            if (existProductInCart){
                console.log('Existe el producto con ese ID aumentaremos su cantidad...')
                const position = searchedCart.products.findIndex(item => item.product._id == productId  )
                //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                !quantity ? searchedCart.products[position].quantity +=1 :  searchedCart.products[position].quantity += quantity
                }
            else{//Agrego el producto si no exciste en el carro
                searchedCart.products.push({product:productId,quantity:quantity})
            } 
            //Actualizo en la BD y retorno.
            searchedCart.markModified("carts")
            await searchedCart.save()
            return {
                success: true, 
                message: !quantity ? `Se agrego una unidad del productID ${productId}` : `Se agregaron ${quantity} unidades del productID ${productId}`, 
                cart: searchedCart
                }
            }
        }
        catch(error){
            console.error('Error al obtener carrito por id.', error);
            return { 
                success: false, 
                message: 'Error al obtener carrito por id (Desde add).', error, 
                cart: null 
            }
        }
    }


       
async deleteProductInCart(cartId,productId){
    /*Esta funcion elimina product Id pasado por parametro al carrito pasado por parametro y Retorna un objeto asi:
   {success: true/false, message: '', cart: carrito actualizado/null}*/
   
   //En este caso tmb deberiamos ver que productId es valido ya que estamos con mongo
   //Busco el carrito donde voy a agregar el producto y la cantidad.
   try{
       const response = await this.getCartById(cartId)
       //Si no encontro el carrito o hubo un error salimos mostrando el mensaje correspondiente.
       if (!response.success){
           console.log(`El cartId proporcionado (${cartId}) no existe o no es un ObjectId válido.`);
           return {
               success: false, 
               message: response.message, //Enviamos el mensaje que nos dio getCartById
               cart: null
               }
       }
       else{
           //Si se encontro el carrito vamos a proceder a eliminar el producto.
           //Trabajo con el carrito encontrado.
           const searchedCart = response.cart //Trabajo con searchedCart por comodidad
           const existProductInCart = searchedCart.products.some(item => item.product.toString() == productId )
           //Find devuelve undefined si no encuentra elemento que cumpla condicion o sea no existe el producto.
           //Find devuelve la primer coinciddencia
           if (existProductInCart){
              
               console.log('El producto esta en el carro, procedemos a eliminarlo...')
               const position = searchedCart.products.findIndex(item => item.product.toString() == productId )
               searchedCart.products.splice(position,1)
           }
           else{
             //Agrego el producto si no exciste en el carro
             console.log(`El producto ${productId} no esta en el carro,no hay nada para eliminar !`)
           } 

           //Actualizo en la BD
           searchedCart.markModified("carts")
           await searchedCart.save()
          //AHora retorno xq salio todo OK          
           return {
               success: true, 
               message: 'Se elimino producto...', //Enviamos el mensaje que nos dio getCartById
               cart: searchedCart
               }
           }
       }
       catch(error){
           console.error('Error al obtener carrito por id.', error);
           return { 
               success: false, 
               message: 'Error al obtener carrito por id (Desde add).', error, 
               cart: null 
           }
       }
   }





       
async addProductsListInCart(cartId,productsList){
    /*Esta funcion agrega/actualiza al carrito pasado por parametro con la informacion del array productsList y Retorna un objeto asi:
   {success: true/false, message: '', cart: carrito actualizado/null}*/
   //productsList es un array de productos como este.. [ { productId: '65e795e3225236e4f71702cc', quantity: 1 },{ productId: '65e795e3225236e4f71702cb', quantity: 2 },]
   //En este caso tmb deberiamos ver que productId es valido ya que estamos con mongo
   //Busco el carrito donde voy a agregar el producto y la cantidad.
   try{
       const response = await this.getCartById(cartId)
       //Si no encontro el carrito o hubo un error salimos mostrando el mensaje correspondiente.
       if (!response.success){
           console.log(`El cartId proporcionado (${cartId}) no existe o no es un ObjectId válido.`);
           return {
               success: false, 
               message: response.message, //Enviamos el mensaje que nos dio getCartById
               cart: null
               }
       }
       else{
           //Si se encontro el carrito vamos a actualizar el array de productos con objetos y cantidades.
           //Trabajo con el carrito encontrado.
           const searchedCart = response.cart //Trabajo con searchedCart por comodidad

            //Recorro el array y voy actualizando el array Products
            productsList.forEach( item => {
                const existProductInCart = searchedCart.products.some(productItem => productItem.product.toString() == item.productId )
                if (existProductInCart){
                    console.log('Existe el producto con ese ID actualizaremos su cantidad...')
                    const position = searchedCart.products.findIndex(productItem => productItem.product.toString() == item.productId )
                    //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                   searchedCart.products[position].quantity += item.quantity
                    }
                else{//Si el carro no tiene este producto le creo el item con la cantidad
                    searchedCart.products.push({product:item.productId,quantity:item.quantity})
                } 
            })
            //Actualice todo el array ahora guardo,Actualizo en la BD y retorno.
           searchedCart.markModified("carts")
           await searchedCart.save()
           return {
               success: true, 
               message: `Se actualizo el carrito con la lista de productos pasada por parametro...`, 
               cart: searchedCart
               }
           }
       }
       catch(error){
           console.error('Error al obtener carrito por id.', error);
           return { 
               success: false, 
               message: 'Error al obtener carrito por id (Desde add).', error, 
               cart: null 
           }
       }
   }
   
         
async clearCart(cartId){
    /*Esta funcion elimina todos los productos al carrito pasado por parametro  Retorna un objeto asi:
   {success: true/false, message: '', cart: carrito actualizado/null}*/
   
   //En este caso tmb deberiamos ver que productId es valido ya que estamos con mongo
   //Busco el carrito el cual voy a vaciar.
   try{
       const response = await this.getCartById(cartId)
       //Si no encontro el carrito o hubo un error salimos mostrando el mensaje correspondiente.
       if (!response.success){
           console.log(`El cartId proporcionado (${cartId}) no existe o no es un ObjectId válido.`);
           return {
               success: false, 
               message: response.message, //Enviamos el mensaje que nos dio getCartById
               cart: null
               }
       }
       else{
           //Si se encontro el carrito vamos a proceder a vaciar su array products.
           //Trabajo con el carrito encontrado.
           const searchedCart = response.cart //Trabajo con searchedCart por comodidad
            response.cart.products = [] //vacio el array
           //Actualizo en la BD
           searchedCart.markModified("carts")
           await searchedCart.save()
          //AHora retorno xq salio todo OK          
           return {
               success: true, 
               message: 'Se vacio el carro...', //Enviamos el mensaje que nos dio getCartById
               cart: searchedCart
               }
           }
       }
       catch(error){
           console.error('Error al obtener carrito por id.', error);
           return { 
               success: false, 
               message: 'Error al obtener carrito por id (Desde add).', error, 
               cart: null 
           }
       }
   }


   async countProductsInCart(cartId){
    //devuelve la cantidad de productos de un carrito determinado
    const searchedCart = await this.getCartById(cartId)
   
    //Voy sumando todos los campos quiantity....
    let productsQuantity = 0
    searchedCart.cart.products.forEach( item => productsQuantity = productsQuantity + item.quantity)
    return productsQuantity
   }
}


