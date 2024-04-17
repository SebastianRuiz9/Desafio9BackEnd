import { promises as fsPromises } from 'fs';
import path from 'path';
import { generarValorAleatorio,generarCodigo } from './codigosprod.js';



const nombreArchivo = 'productos.json'
const directorioActual = process.cwd();
const rutaCompleta = path.join(directorioActual, nombreArchivo);
const arrayProductos = []


for (let i = 1; i<=1000;i++){

    const nuevoProducto = {
        title: 'Producto ' + i, 
        description: 'Descripcion de producto ' + i, 
        price: generarValorAleatorio(1,200000),
        img: '/img/products/generic.jpg',
        code: generarCodigo(),
        category: 'Categoria '+ generarValorAleatorio(1,50),//Supongo hay 50 categorias.
        stock: generarValorAleatorio(1,9999),
        status: generarValorAleatorio(1,100) <=50 ? true :false ,
        thumbnails:[]
    }

    arrayProductos.push(nuevoProducto)

}



//Aca mapeamos lo que queremos.
const contenidoJSON = JSON.stringify(arrayProductos,null,1)

    // Escribir el archivo JSON de forma asíncrona
await fsPromises.writeFile(rutaCompleta, contenidoJSON, 'utf8')
  



