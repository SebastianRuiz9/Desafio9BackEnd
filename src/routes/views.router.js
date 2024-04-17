import express from 'express'
import { ProductManager } from '../controllers/product-manager-db.js'
import { uploadProductImage } from '../config/multer-configs.js'
//Creo la instancia de router.
export const router = express.Router()
const productManager = new ProductManager()


router.get('/',(req,res)=>{

    res.render('home')
})

router.get('/viewproducts', async (req,res)=>{
    try{
        const products = await productManager.getProducts()
        //Mapeo para poder renderizar en handlebars
        const mappedProducts = products.map(item => ({
            id: item.id, 
            title: item.title,
            description: item.description,
            price: item.price,
            img: item.img,
            code: item.code,
            category: item.category,
            stock: item.stock,
            status: item.status,
            thumbnails: item.thumbnails
        }))

        res.render('products',{productsList:mappedProducts})
    }
    catch(error){
        console.log(error)
        res.status(500).render('error', { errorMessage: 'Error interno del servidor' });
    }
})

router.get('/product/:pid',async(req,res)=>{
    //Recibo por parametro el id del producto y lo uso para pedir al manager los datos de dicho producto..
    const {pid} = req.params
    try {
        const product = await productManager.getProductById(pid)
        //ya tengo el producto, ahora lo proceso para poder usarlo en handlebars
        const productDetail = {
            id: product._id, 
            title: product.title,
            description: product.description,
            price: product.price,
            img: product.img,
            code: product.code,
            category: product.category,
            stock: product.stock,
            status: product.status,
            thumbnails: product.thumbnails
        }

       res.render('productdetail', {productDetail: productDetail})
    } catch (error) {
        
    }
})
 

//En esta funcion no hay problema con el mapeo de handlebars xq trabaja por dom
router.get('/realtimeproducts',(req,res)=>{
    res.render("realTimeProducts")
})


router.get('/chat',async (req,res)=>{
     res.render('chat/chat')
})



router.post('/upload', uploadProductImage.single('file'), (req, res) => {
    
    console.log('Llego a post: ', req.file, req.body, req.file.filename)
    const nombreArchivo = req.file.filename;
    console.log(' EN router Archivo subido con éxito. Nombre en el servidor:', nombreArchivo);
    // Respondemos con el nombre del archivo en el cuerpo de la respuesta
    res.status(200).json({ filename: nombreArchivo });
  });
  
  

