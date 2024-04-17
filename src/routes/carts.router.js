import express from 'express'
import { ProductManager } from '../controllers/product-manager-db.js'
import { CartsManager } from '../controllers/carts-manager-db.js'


//Creo mi instancia de objeto Router
export const router = express.Router()
//Creo instancia de mi cart Manager.
const cartsManager = new CartsManager()

const productManager = new ProductManager()


router.get('/api/carts/:cid',async (req,res)=>{
    //Esta ruta devuelve un carrito
    const {cid} = req.params
    try {
        const response = await cartsManager.getCartById(cid)
        if (response.success){
        console.log('Require cart', response)
        res.json({cartId: response.cart._id, products: response.cart.products})
       }
       else{
        res.send(response.message)
       }
    } catch (error) {
        console.log(`Error al obtener carrito id ${cid}!.`, error)
        res.status(500).json({error: 'Error del servidor'})
    }
})

router.post('/api/carts',async (req,res)=>{
    //Esta ruta simplemente crea un carrito y lo envia al cliente para ser mostrado.
    try{
        const newCart = await cartsManager.createCart()
        res.json(newCart)
        }
    catch(error){
        console.log('Error al crear carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }

  
})


router.post('/api/carts/:cid/products/:pid',async(req,res)=>{
    //Agregar el producto pasado por paremtro (su id) al carrito pasado por su parametro id.
    //De estar el producto incrementa la cantidad de uno, de no estar lo crea y agrega una unidad del mismo.
    const {cid:cartId,pid:productId} = req.params
    const {quantity} = req.body
     //console.log('FFFF: ',cartId,productId) 
     //console.log('Quantity: ',req.body,quantity) 
    try{
        const response = await cartsManager.addProductInCart(cartId,productId,Number(quantity))
        if (response.success){
            //console.log(response.success)
            //res.json({cartId: response.cart._id, products: response.cart.products})
            //Redirijo a esta direccion para que se vea grafico lo que hay en el carrito que estamos agregando de manera provisoria.
            //res.redirect(`/carts/${cartId}`);
            res.status(200).json({message: response.message});
           
        }
        else{
            res.status(500).json({message: response.message});
        }
       
    }
    catch{
        console.log('Error al ingresar el producto carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
    
})

router.delete('/api/carts/:cid/products/:pid', async(req,res)=>{
    const {cid,pid} = req.params // Obtengo los parametros.
    
    try {
        const response = await cartsManager.deleteProductInCart(cid,pid)
        if (response.success){
            //console.log(response.success)
            res.json({cartId: response.cart._id, products: response.cart.products})
        }
        else{
            res.send(response.message)
        }
       
    }
    catch{
        console.log('Error al ingresar el producto carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
})

router.put('/api/carts/:cid', async(req,res)=>{
    //Este endpoint toma por body un array de productos y cantidades y los agrega al carrito cid
    //Va a recorrer el array que reccibe por body y usando la funcion addProductInCart agregue esos productos.
    const {cid:cartId} = req.params
    const {productsArray} = req.body
    try{
        const response = await cartsManager.addProductsListInCart(cartId,JSON.parse(productsArray))
        if (response.success){
            //console.log(response.success)
            res.json({cartId: response.cart._id, products: response.cart.products})
        }
        else{
            res.send(response.message)
        }
       
    }
    catch{
        console.log('Error al ingresar el producto carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
})


router.put('/api/carts/:cid/products/:pid', async(req,res)=>{
    const {cid:cartId,pid:productId} = req.params // Obtengo los parametros.
    const {quantity} = req.body
    try{
        const response = await cartsManager.addProductInCart(cartId,productId,quantity)
        if (response.success){
            //console.log(response.success)
            res.json({cartId: response.cart._id, products: response.cart.products})
        }
        else{
            res.send(response.message)
        }
       
    }
    catch{
        console.log('Error al ingresar el producto carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
})

router.delete('/api/carts/:cid', async(req,res)=>{

    const {cid:cartId} = req.params // Obtengo los parametros.
    
    try {
        const response = await cartsManager.clearCart(cartId)
        if (response.success){
            //console.log(response.success)
            res.json({cartId: response.cart._id, products: response.cart.products})
        }
        else{
            res.send(response.message)
        }
       
    }
    catch{
        console.log('Error al vaciar el carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
})

router.get('/carts/:cid',async(req,res)=>{
    const {cid:cartId} = req.params
    try{
       const response = await cartsManager.getCartById(cartId)
       if ( response.success ){
            //console.log('Cartin: ', response.cart.products)
            //mapeo la lista de productos a renderizar y luego obtengo su total del carrito.
            const productsList = response.cart.products.map(item => (
                {id:item.product._id,
                img:item.product.img,
                title:item.product.title,
                price:item.product.price,
                quantity:item.quantity,
                totalAmount: Number(item.quantity) * Number(item.product.price)

            }))

            //Calculo el total del carro
           let cartAmount = 0;
           for (let p in productsList) {
            cartAmount = cartAmount + productsList[p].totalAmount
        }

          
           
            res.render('cart',{cartId:cartId, productsList: productsList, cartAmount:cartAmount })
       }
       else{
        res.send(response.message)
       }
    
    }catch(error){
        console.log('Error al obtener el carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }

    
})