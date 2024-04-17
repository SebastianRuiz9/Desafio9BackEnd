
//Inicio la comunicacion mediante websockets.
const socket = io()

//Funciones accesorias.
function validateAddProductForms(){
  //Esta funcion valida y devuelve true o false.
  return true
}

//Agrego evento al boton enviar del form y le digo que ejecute la funcion addProduct.
document.getElementById('addProductsForm').addEventListener('submit',(e)=>{
  //Evito el comportamiento predeterminado del form.
  e.preventDefault()
  //validos los datos y si estan correctos procedo a llamar a la funcion addProduct
  //la funcion addProduct se encarga de comunicarse con el server y darle los datos.
  if (validateAddProductForms()) addProduct()
  else alert('El formulario contiene campos no validos.')
})

async function addProduct(){
  /*
    1- Si fue todo validado OK en el form entonces se ejecuta esta funcion.
    2- A partir de los elementos del form forma el objeto para enviar por socket y que se cargue a la BD desde el server.
    3- Usando una solicitud http envia al server un archivo y le coloca el nombre que le generaremos.
    4- es para darle un nombre unico y que coincida con el que le enviaremos a la BD
    5- Primero subimos archivo entonces y luego depende el resultado en la BD lo dejamos o borramos pero de eso se encarga el server.

  */
  try{
    //subimos el archivo usando fetch.
    const file = document.getElementById('input-img').files[0]
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

     const uploadFileResponse = await fetch('/upload', {method: 'POST', body: formData})
      
      if (uploadFileResponse.ok) {
        const responseData = await uploadFileResponse.json()
        //Ya tenemos el nombre que multer le dio al archivo, se lo tenemos que indicar al objeto que enviaremos.
        console.log('Archivo subido con éxito. Nombre en el servidor:', responseData.filename)
        //Le agregamos el path por delante para tener la info correcta.
        const fileNamePathInServer = '/img/products/'+ responseData.filename
       
        //Y ahora podemos enviar todo al server por websocket.
         const productObject = {
          title : document.getElementById('input-title').value,
          description : document.getElementById('input-description').value,
          price : document.getElementById('input-price').value,
          //La img se subira a su vez a public asiq a la BD le mandamos la ruta en public
          img: fileNamePathInServer,
          code : document.getElementById('input-code').value,
          category: document.getElementById('input-category').value,
          stock : document.getElementById('input-stock').value,
          status : document.getElementById('input-status').value,
          thumbnails: []//Provisorio 
        }
        
        //console.log(productObject)
        //Ya esta todo en condiciones para enviar al server. Envio el obeto y el nombre del archivo en el server por si hay que borrarlo
        //Hay que borrarlo si falla entrada  ala base de datos para mantener limpia la BD.
        socket.emit('addProduct',productObject,fileNamePathInServer)


      } else {
        console.error('Error al subir el archivo:', uploadFileResponse.status);
      }
    }
  

  }catch(error){

  }



}


//Recibo la lista de productos x socket y construyo la lista con el dom.
socket.on('eventProducts',(data)=>{
    alert('escucuche eventProducts')
    console.log('Data eventProducts: ', data)
    //Agregamos los elementos al dom en nuestra div grid donde van los productos y tiene id='containerproducts'
    //Pero antes limpiamos el container xq como esto escucha constantemente va a agregar cada vez que escuche.
    const containerProducts = document.getElementById('containerproducts')
    //Con esto limpio
    if (containerProducts) {// Elimina todos los nodos hijos
        while (containerProducts.firstChild) {
          containerProducts.removeChild(containerProducts.firstChild);
        }
      } else console.error('El elemento con el ID especificado no existe.');
    //Recorro el array y x cada elemento agrego el product Al container
    data.forEach(item =>addProductCartToContainer(containerProducts, item.title, item.price, item._id,item.img))
 })

 //Cuando escucha el mensaje del resultado de agregar da un alert
 socket.on('resultAddMessage',(data)=>alert(data))

 function deleteProduct(productId){
    //Al ejecutarse esta funcion a travez del boton hacemos socket.emit  enviamos el id a eliminar-
    //Entonces el server escucha y hace lo necesario para eliminar ese id.
    //console.log('Se apreto ', productId) 
    socket.emit('deleteProduct',productId)
}

//Cuando escucha el mensaje del resultado de eliminar da un alert
socket.on('resultDeleteMessage',(data)=>alert(data))

function deleteProduct(productId){
   //Al ejecutarse esta funcion a travez del boton hacemos socket.emit  enviamos el id a eliminar-
   //Entonces el server escucha y hace lo necesario para eliminar ese id.
   //console.log('Se apreto ', productId) 
   socket.emit('deleteProduct',productId)
}










function addProductCartToContainer(instanciaDom,productName,productPrice,productId,productImg) {
  // Crear el contenedor principal
  const contenedorProducto = document.createElement('div');
  contenedorProducto.className =
    'bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative';

  // Crear el ícono en la esquina superior derecha
  const iconoContenedor = document.createElement('div');
  iconoContenedor.className =
    'bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-4 right-4';

  const svgIcono = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcono.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgIcono.setAttribute('width', '18px');
  svgIcono.setAttribute('class', 'fill-gray-800 inline-block');
  svgIcono.setAttribute('viewBox', '0 0 64 64');

  const pathIcono = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathIcono.setAttribute(
    'd',
    'M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z'
  );
  pathIcono.setAttribute('data-original', '#000000');

  svgIcono.appendChild(pathIcono);
  iconoContenedor.appendChild(svgIcono);

  // Crear la sección de la imagen del producto
  const contenedorImagen = document.createElement('div');
  contenedorImagen.className =
    'max-lg:w-11/12 w-4/5 h-[220px] overflow-hidden mx-auto aspect-w-16 aspect-h-8';

  const imagenProducto = document.createElement('img');
  imagenProducto.src = productImg //'/images/product1.jpeg'; //'https://readymadeui.com/images/coffee1.webp';
  imagenProducto.className = 'h-full w-full object-contain';

  contenedorImagen.appendChild(imagenProducto);

  // Crear la sección de texto del producto
  const contenedorTexto = document.createElement('div');
  contenedorTexto.className = 'text-center mt-4';

  const tituloProducto = document.createElement('h3');
  tituloProducto.className = 'text-lg font-bold text-gray-800';
  tituloProducto.textContent = productName;

  const precioProducto = document.createElement('h4');
  precioProducto.className = 'text-xl text-gray-700 font-bold mt-4';
  precioProducto.textContent = '$'+productPrice;

  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.className = "my-5 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
  botonEliminar.textContent = 'Eliminar';
  botonEliminar.addEventListener('click',()=>{
      console.log('Se clickeo id: ', productId)
      deleteProduct(productId)
      
  })

  const idTag = document.createElement('p')
  idTag.className= "text-sm text-gray-500 truncate dark:text-gray-400"
  idTag.innerHTML= 'Producto Id:' + productId + '.'

  contenedorTexto.appendChild(tituloProducto);
  contenedorTexto.appendChild(precioProducto);
  contenedorTexto.appendChild(botonEliminar);
  contenedorTexto.appendChild(idTag)

  // Agregar los elementos al contenedor principal
  contenedorProducto.appendChild(iconoContenedor);
  contenedorProducto.appendChild(contenedorImagen);
  contenedorProducto.appendChild(contenedorTexto);


  // Agregar el contenedor principal al DOM
  instanciaDom.appendChild(contenedorProducto);
}





