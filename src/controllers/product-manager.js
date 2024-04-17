/* Importamos el modulo fs */
//const fs = require('fs')
import fs from 'fs'


class ProductManager {
    //Contador para siempre tener un ID diferente
    
    constructor(path) {
      this.path= path
      this.products = []
      this.countID = 1 
      /*Al crear la instancia ira a leer el archivo del path y de acuerdo a exista o no... 
      si existe lo lee, si no existe, lo crea e inicializa con un array vacio y pone el countID en el ultimo ID que estaba...*/
      this.init()
    }

    init =  ()=>{
      if (!fs.existsSync(this.path)){
        this.saveProductsInFile(this.products) 
       
      }
     else{//En este caso lo lei sincronicamente puesto que nuestro programa efectivamente necesita de los datos.
      const fileData = fs.readFileSync(this.path,'utf-8')//await this.readProductsInFile()
      //No solo debo ahora asignar la data a products, tmb debo actualizar el IDcount
      //Teniendo en cuenta en que productManager guarda en orden y sin repetir, leo el ultimo id y le sumo1.
      const productListInFile = JSON.parse(fileData)

      if (productListInFile.length > 0){
        this.products = productListInFile
        this.countID = productListInFile[productListInFile.length-1].productID 
        
      }

      
     }
       

    }
  
    AddProduct = async (product) => {
      
      
         if (!this.products.some((item) => item.code == product.code)) {
        /*Le damos un ID y luego incremento ese ID para que me quede listo al venir el siguiente producto.*/
        //this.products.push({productID: ProductManager.countID, ...product })
        this.countID += 1;
        this.products = [...this.products,{productID: this.countID, ...product }]
        console.log("Se Ingreso el producto solicitado con Id: " +  this.countID + ".");
        
        /*Guardamos el array productos*/
        await this.saveProductsInFile(this.products)
      } else {
        console.log("Ya existe el producto con code " + product.code + " !");
      }
    };
  
    // Devuelve la lista de prdductos.
    getProducts = async () => {
        const productsInFile = await this.readProductsInFile()
        return productsInFile
    }
  
    /*
     Devuelve el producto que tiene el ID que se le pasa por parametro. SI existe un producto con ese ID entonces lo retorna, de lo contrario devuelve
     un array vacio y un mensaje por consola que dice 'not found!'.
     
     */
    getProductById = async (searchProductID) => {
        //Leo el archivo, a diferencia de mi desafio uno levanto los datos del archivo
        try{
            const productsList = await this.readProductsInFile()
            if (productsList.some((item) => item.productID == searchProductID)) {
            const searchedProduct = productsList.find((item) => item.productID == searchProductID)
            return searchedProduct;
            } else {
              throw new Error("Product Not Found")
            }
        } catch(error){
            console.log('Error: ', error.message)
            return null
        }
    };

    async updateProduct(productIdToUpdate,updateItems){
        
        try{
            //Actualizamos en this.products y luego volcamos todo al archivo
            const productIndex = this.products.findIndex(item => item.productID == productIdToUpdate)
            if (productIndex >= 0){
                //Actualizo a this.products con la informacion recibida por parametro y sin borrar ID
                //Pero debo cuidar que de afuera me envien keys que correspondan para no llenar de basura la BD ni modificar productID.
                if (!Object.keys(updateItems).includes('productID')){
                  this.products[productIndex] = {...this.products[productIndex],...updateItems}
                //Ingreso la modificacion de this.products al archivo.
                  await this.saveProductsInFile(this.products)
                }
                else{
                  throw new Error("No se puede modificar productID !!!")
                }
                 }
        } catch(error){
          console.log('Error: ', error.message)
          return null
        }
        
      
    }

    async deleteProduct(productIdToDelete){
       try{ //Si existe el producto buscado proceso al borrado
        if (this.products.some((item) => item.productID == productIdToDelete)){
          //Lo modifico en this.products, en este caso lo elimino. Busco su index.
          const productIndex = this.products.findIndex(item => item.productID == productIdToDelete)
          //Como ya use el metodo some ya se que existe por lo tanto proceso a su borrado.
          this.products.splice(productIndex,1)
          //console.log('Ahora ', this.products)
          //Actualizo el archivo.
          this.saveProductsInFile(this.products)
        }
        else{
          throw new Error("No existe el producto con el productID ingresado !!!")
        }

       } catch(error){
        console.log('Error: ', error.message)
        return null
       }
 
    }


    async saveProductsInFile(content){
        //Genero el archivo. Ya que siempre antes de guardar pusheo el array entonces puedo pisar tranquilo el archivo.
        try{
            //console.log('Content: ', content)
            const jsonString = JSON.stringify(content, null, 1)
            await fs.promises.writeFile(this.path,jsonString)
        }
        catch(error){
            console.log('Error al guardar el archivo.',error)
        }
    }

    readProductsInFile = async () => {
        try{ //Leo y retorno la respuesta de la lectura asincrona del archivo.
            const fileContent = await fs.promises.readFile(this.path,"utf-8")
            return JSON.parse(fileContent)
        }
        catch(error){
            console.log('Error al leer el archivo.',error)
        }
    }

    

  }
  

//module.exports = ProductManager
export {ProductManager}