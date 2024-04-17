import { ProductModel } from "../models/product.model.js";

export class ProductManager{
    
    //Esta funcion agrega el producto y retorna el producto recien agregado. Retorna un objeto asi:
    //{success: true/false, message: '',product: producto Agregado}
    //Si producto no fue agregado devuelve null
    async addProduct({title, description,price,img,code,category,stock,status,thumbnails}){
        try{
            //Comprobamos que vengan todos los campos en los parametros
            if (!title || !description || !price|| !img || !code ||  !category || !stock || !status|| !thumbnails){
                console.log('Es necesario ingresar todos los campos...')
                return {success: false, message: 'Es necesario ingresar todos los campos...',product: null}
            }
            //Busco que el producto no exista.
            console.log('Existe code: ', code)
            const existProduct = await ProductModel.findOne({code:code})
            console.log('Existe: ', existProduct)
            if (existProduct){
                //Si el codigo existe no agrego entonces salgo de la funcion enviando un mensaje a quien invoco
                console.log('Existe un producto con este codigo...')
                return {success: false, message:  `El producto no fue agregado. Ya existe un producto con codigo ${code}`,product: null}
            }
            //Si no existe procedemos a agregarlo.
            const nuevoProducto = new ProductModel({title, description,price,img,code,category,stock,status,thumbnails})
            nuevoProducto.save()
            //guarde el producto en la base de Datos ahora mando msg de OK
            return {success: true, message:`Se guardo en la BD el producto enviado bajo el id ${nuevoProducto.id}`,product:nuevoProducto}
        }catch(error){
            res.status(500)
        }
    }

    async getProducts(){
      try {
        const products = await ProductModel.find()
        //Tengamos la consideracion que mongo los id los pasa como 'id...', arreglo eso antes de retornar.
        return products

      } catch (error) {
        console.log('Error al recuperar los productos...')
        throw error
      }
    }

    async getProductsPaginate(limit,page,sort,query){
        try {
          //sort puede ser 1,-1 o undefined
          const sortBy = sort == 1 ? {price:1} : sort == -1 ? {price:-1} : {}
          const filterBy = query ? query : {} //Provisorio hasta que se implemente el filtro visual
          const products = await ProductModel.paginate(filterBy,{limit:limit,page:page, sort:sortBy})

          //Tengamos la consideracion que mongo los id los pasa como 'id...', arreglo eso antes de retornar.
          return products
  
        } catch (error) {
          console.log('Error al recuperar los productos...')
          throw error
        }
      }

    async getProductById(id){
       try{
        const product = await ProductModel.findById(id)
        if (!product){
            console.log('Producto no encontrado...')
            return
        }
      
        console.log('Producto encontrado...')
        return product
       
       }
        catch(error){

        }
       }

    async updateProduct(id,newProduct){
        try {
           const updatedProduct = await ProductModel.findByIdAndUpdte({id,newProduct}) 
           if (!updatedProduct){ //SI no pasa nada salgo.
            console.log('Producto no encontrado...')
            return null //Esto me hace salir.
           }
          
            console.log('Producto actualizado...')
            return updatedProduct
           
        } catch (error) {
            
        }
    }

    async deleteProduct(id){
        //Esta funcion elimina el producto de id pasado por parametro y retorna el campo img para que el server sepa que archivo borrar y mantener limopia la BD
        // Retorna un objeto asi: {success: true/false, message: '',imgpath: imgpath o null}
        
        try {
           //Antes de borrar el producto obtengo su atributo img
           const {img} = await this.getProductById(id)
           const deletedProduct = await ProductModel.findByIdAndDelete(id) 
           if (!deletedProduct){
            console.log('Producto no encontrado...')
            return {success: false, message: `No se encontro producto con id ${id}.`,imgpath: null}
           }
          
            console.log('Producto eliminado...')
            return {success: true, message: `Producto con id ${id} eliminado.`,imgpath: img}
           
          
        } catch (error) {
            console.log('Error al eliminar los producto...')
            throw error
        }
    }

    
    //Metodo privado que renderiza y devuelve objetos comunes para ser leidos por handlebars
    

    //-----------------------------------------------------------------------------------   
    }

