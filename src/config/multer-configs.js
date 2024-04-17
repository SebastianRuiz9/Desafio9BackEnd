import multer from "multer";
import fs from 'fs'

//Configuracion de multer para que guarde el archivo es images con el nombre que ya viene
//aunque previamante haremos que cuando se suba tenga un nombre unico pero esto es independite a multer

const storageForProducts = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationFolder = './src/public/img/products';
      // Verificar si la carpeta de destino existe, si no, crearla
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
      }
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  
  //Esta funcion sube archivos al server usando la configuracion de storageForProducts
  //const uploadProductImage = multer({storageForProducts})
  const uploadProductImage = multer({ storage: storageForProducts });

  export {uploadProductImage}