
import fs from 'fs'

class cartsManager{

    /*
     Siembre trabajamos con this.carts, nuestra instancia carts manager cada vez que haya una modificacion en su
     contenido va a pisar y guardar todo en su archivo, por eso no seria necesario leer el archivo en los metodos get
     o exist. En cambio es necesario usar asincronismo al crear/modificar carros ya que esa informacion debe ser respaldada
     luego de la creacion y/o modificacion.
    */
    constructor(path){
        this.lastId = 0
        this.path = path
        this.carts = []

       this.init()
    }

    init =  ()=>{
        if (!fs.existsSync(this.path)){
            this.saveCartsInFile(this.carts)
        }
       else{//En este caso lo lei sincronicamente puesto que nuestro programa efectivamente necesita de los datos.
        const fileData = fs.readFileSync(this.path,'utf-8')
        //No solo debo ahora asignar la data a products, tmb debo actualizar el IDcount
        //Teniendo en cuenta en que productManager guarda en orden y sin repetir, leo el ultimo id y le sumo1.
        const cartListInFile = JSON.parse(fileData)
        //console.log('conte: ',cartListInFile)
        //Que pasa si se creo el archivo pero solo tiene el array?? 
            if (cartListInFile.length > 0){
                   
                //si no es solo array o sea hay productos entonces pongo el ulti
                this.carts = cartListInFile
                this.lastId = cartListInFile[cartListInFile.length-1].cartId 
                //console.log('discarts:' ,this.carts)
            }
             
       }
           
      }

      //Si no existe lo genera.
      async saveCartsInFile(content){
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
    

    createCart = async () => {
        /*
          crea un carro y le asigna un ID y lo deja listo para agregar productos.
          Guarda todo el this.carts recien modificado en el archivo.
          Si el proceso resulto OK devuelve el id del carro recientemente creado.
        */
          try{
            this.carts.push({cartId: this.lastId+1,products:[]})
            //Aumento el lastId
            this.lastId +=1
            //Guardo el array carts en el archivo
            await this.saveCartsInFile(this.carts)
            //Retorna el Id del carro recien creado.
            return this.lastId
        }
        catch(error){
            console.log(error)
        }
        

    }

    //Devuelve el producto del carro si existe, y si no undefined
    getProducsFromCart = (cartId) => this.carts.find(cart => cart.cartId == cartId).products

    //Devuelve la cantidad de carros que hay en existencia.
    getCarsQuantity = ()=> this.carts.length

    addProductInCart = async (cartId,productId, quantity) => {
        //Si existe un carro con este ID procedo
        if (this.carts.some(cart => cart.cartId == cartId)){
            const cartPosition = this.carts.findIndex(cart => cart.cartId == cartId)
            //Ahora tengo que trabajar sobre esa posicion
            //Busco en el array de productos del carro si ya existe el producto.
            if (this.carts[cartPosition].products.some(product => product.productId == productId)){
                //Si existe modifico la cantidad
                //Busco la posicion del producto en el array de prodctos
                const productPosition = this.carts[cartPosition].products.findIndex(product => product.productId == productId)
                this.carts[cartPosition].products[productPosition].quantity += quantity
            }
            else{
                //SI no existe agrego el nuevo productID y su cantidad
                this.carts[cartPosition].products.push({productId: productId, quantity: quantity})
            }
            //Una vez hecho todo el proceso modifico el archivo.
            this.saveCartsInFile(this.carts)

        }
        else return undefined
    }

    //Devuelve true o false segun exista un cart con ese ID
    existCart(cartId){
        if (this.carts.some(cart => cart.cartId == cartId)) return true
        else return false
    }

}

export {cartsManager}